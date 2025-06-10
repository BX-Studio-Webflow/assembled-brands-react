import React, { useState, useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import { HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import type { Lead } from '@/@types/lead'
import {
    apiDeleteLead,
    apiCreateTagAssignment,
    apiDeleteTag,
} from '@/services/LeadsService'
import CreatableSelect from 'react-select/creatable'
import type { MultiValue } from 'react-select'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

type ProfileSectionProps = {
    data: Lead
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold">{title}</span>
            <p className="heading-text font-bold">{value}</p>
        </div>
    )
}

const ProfileSection = ({ data }: ProfileSectionProps) => {
    const navigate = useNavigate()
    const [dialogOpen, setDialogOpen] = useState(false)
    const initialOptions: { value: number; label: string }[] = (
        data.tags ?? []
    ).map((ev) => ({
        value: ev.tag.id,
        label: ev.tag.tag,
    }))
    const [tagOptions, setTagOptions] =
        useState<{ value: number; label: string }[]>(initialOptions)
    const [selectedTags, setSelectedTags] =
        useState<{ value: number; label: string }[]>(initialOptions)
    const prevTagsRef =
        useRef<{ value: number; label: string }[]>(initialOptions)

    useEffect(() => {
        const opts: { value: number; label: string }[] = (data.tags ?? []).map(
            (ev) => ({
                value: ev.tag.id,
                label: ev.tag.tag,
            }),
        )
        setTagOptions(opts)
        setSelectedTags(opts)
        prevTagsRef.current = opts
    }, [data.tags])

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleDialogOpen = () => {
        setDialogOpen(true)
    }

    const handleDelete = async () => {
        setDialogOpen(false)
        try {
            await apiDeleteLead(String(data.id))
            toast.push(
                <Notification type="success">
                    Lead deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/concepts/lead/lead-list')
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete lead. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDialogOpen(false)
        }
    }

    const handleSendMessage = () => {
        navigate('/concepts/mail')
    }

    const handleChange = (
        newValue: MultiValue<{ value: number; label: string }>,
    ) => {
        const arr = Array.isArray(newValue)
            ? (newValue as { value: number; label: string }[])
            : []

        // Find removed tags
        const removedTags = prevTagsRef.current.filter(
            (prevTag) => !arr.some((tag) => tag.value === prevTag.value),
        )

        // Find added tags
        const addedTags = arr.filter(
            (newTag) =>
                !prevTagsRef.current.some(
                    (prevTag) => prevTag.value === newTag.value,
                ),
        )

        // Remove tags via API
        removedTags.forEach(async (tag) => {
            try {
                await apiDeleteTag(String(tag.value), String(data.id))
            } catch {
                toast.push(
                    <Notification type="danger">
                        Failed to remove tag. Please try again.
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        })

        // Add tags via API
        addedTags.forEach(async (tag) => {
            try {
                await apiCreateTagAssignment({
                    lead_id: data.id,
                    tag: String(tag.value),
                })
            } catch {
                toast.push(
                    <Notification type="danger">
                        Failed to add tag. Please try again.
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        })

        // Update state
        setSelectedTags(arr)
        prevTagsRef.current = arr
    }

    const handleCreate = async (inputValue: string) => {
        try {
            const newTag = await apiCreateTagAssignment({
                lead_id: data.id,
                tag: inputValue,
            })

            const newOption = {
                value: newTag.id,
                label: inputValue,
            }

            setTagOptions((prev) => [...prev, newOption])
            setSelectedTags((prev) => [...prev, newOption])
            prevTagsRef.current = [...selectedTags, newOption]

            return newOption
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to create tag. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
            // Return option even on error to maintain UI state
            return { value: Date.now(), label: inputValue }
        }
    }

    return (
        <>
            <CreatableSelect
                isMulti
                isClearable={false}
                onChange={handleChange}
                onCreateOption={handleCreate}
                options={tagOptions}
                value={selectedTags}
                placeholder="Select or type to add tags"
                isSearchable={true}
                closeMenuOnSelect={true}
                name="tags"
            />
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                    <CustomerInfoField title="Email" value={data.email} />
                    <CustomerInfoField
                        title="Phone"
                        value={`${data.dial_code}${data.phone}`}
                    />
                    <CustomerInfoField
                        title="Created"
                        value={dayjs(data.created_at).format(
                            'DD MMM YYYY hh:mm A',
                        )}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <Button block variant="solid" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                    <Button
                        block
                        customColorClass={() =>
                            'text-error hover:border-error hover:ring-1 ring-error hover:text-error'
                        }
                        icon={<HiOutlineTrash />}
                        onClick={handleDialogOpen}
                    >
                        Delete
                    </Button>
                </div>
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title="Delete lead"
                    onClose={handleDialogClose}
                    onRequestClose={handleDialogClose}
                    onCancel={handleDialogClose}
                    onConfirm={handleDelete}
                >
                    <p>
                        Are you sure you want to delete this lead? All records
                        related to this lead will be deleted as well. This
                        action cannot be undone.
                    </p>
                </ConfirmDialog>
            </div>
        </>
    )
}

export default ProfileSection
