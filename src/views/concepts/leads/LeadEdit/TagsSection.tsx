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
    // Convert hostTags to options format
    const hostTagOptions: { value: number; label: string }[] = (
        data.hostTags ?? []
    ).map((hostTag) => ({
        value: hostTag.id,
        label: hostTag.tag,
    }))

    // Convert currently assigned tags to options format
    const assignedTagOptions: { value: number; label: string }[] = (
        data.tags ?? []
    ).map((ev) => ({
        value: ev.tag.id,
        label: ev.tag.tag,
    }))

    // Combine host tags and assigned tags, removing duplicates by text
    const allTagOptions: { value: number; label: string }[] = []
    const seenLabels = new Set<string>()

    // Add assigned tags first
    assignedTagOptions.forEach((tag) => {
        if (!seenLabels.has(tag.label)) {
            allTagOptions.push(tag)
            seenLabels.add(tag.label)
        }
    })

    // Add host tags that don't have duplicate text
    hostTagOptions.forEach((tag) => {
        if (!seenLabels.has(tag.label)) {
            allTagOptions.push(tag)
            seenLabels.add(tag.label)
        }
    })

    const [tagOptions, setTagOptions] =
        useState<{ value: number; label: string }[]>(allTagOptions)
    const [selectedTags, setSelectedTags] =
        useState<{ value: number; label: string }[]>(assignedTagOptions)
    const prevTagsRef =
        useRef<{ value: number; label: string }[]>(assignedTagOptions)

    useEffect(() => {
        // Update host tag options when data.hostTags changes
        const newHostTagOptions: { value: number; label: string }[] = (
            data.hostTags ?? []
        ).map((hostTag) => ({
            value: hostTag.id,
            label: hostTag.tag,
        }))

        // Update assigned tag options when data.tags changes
        const newAssignedTagOptions: { value: number; label: string }[] = (
            data.tags ?? []
        ).map((ev) => ({
            value: ev.tag.id,
            label: ev.tag.tag,
        }))

        // Combine host tags and assigned tags, removing duplicates by text
        const newAllTagOptions: { value: number; label: string }[] = []
        const newSeenLabels = new Set<string>()

        // Add assigned tags first
        newAssignedTagOptions.forEach((tag) => {
            if (!newSeenLabels.has(tag.label)) {
                newAllTagOptions.push(tag)
                newSeenLabels.add(tag.label)
            }
        })

        // Add host tags that don't have duplicate text
        newHostTagOptions.forEach((tag) => {
            if (!newSeenLabels.has(tag.label)) {
                newAllTagOptions.push(tag)
                newSeenLabels.add(tag.label)
            }
        })

        setTagOptions(newAllTagOptions)
        setSelectedTags(newAssignedTagOptions)
        prevTagsRef.current = newAssignedTagOptions
    }, [data.hostTags, data.tags])

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

        // Add tags via API - send the tag text (label) instead of ID
        addedTags.forEach(async (tag) => {
            try {
                await apiCreateTagAssignment({
                    lead_id: data.id,
                    tag: tag.label, // Send the tag text, not the ID
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
