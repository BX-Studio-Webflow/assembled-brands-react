import { useState, useEffect, useRef } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import type { Lead } from '@/@types/lead'
import { apiCreateTagAssignment, apiDeleteTag } from '@/services/LeadsService'
import CreatableSelect from 'react-select/creatable'
import type { MultiValue } from 'react-select'

type TagsSectionProps = {
    data: Lead
}

const TagsSection = ({ data }: TagsSectionProps) => {
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
                options={tagOptions}
                value={selectedTags}
                placeholder="Select or type to add tags"
                isSearchable={true}
                closeMenuOnSelect={true}
                name="tags"
                onChange={handleChange}
                onCreateOption={handleCreate}
            />
        </>
    )
}

export default TagsSection
