import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useMailStore } from '../store/mailStore'
import { FormItem, Form } from '@/components/ui/Form'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { apiCreateMail, apiSearchMails } from '@/services/MailService'
import { AxiosError } from 'axios'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'
import type { SingleValue } from 'react-select'
import useMail from '../hooks/useMail'
import useQuery from '@/utils/hooks/useQuery'
import { MailCreateResponse } from '@/@types/mail'
import { EventWithDetails } from '@/@types/events'
import dayjs from 'dayjs'

type FormSchema = {
    content: string
    title: string
    type: string
    filterType: 'everyone' | 'attended' | 'notAttended'
    recipients: number | null
    selectedMembership: number | null
}

const validationSchema: ZodType<FormSchema> = z
    .object({
        title: z.string().min(1, { message: 'Please enter title' }),
        content: z.string().min(1, { message: 'Please enter message' }),
        type: z.string(),
        filterType: z.enum(['everyone', 'attended', 'notAttended']),
        recipients: z.number().nullable(),
        selectedMembership: z.number().nullable(),
    })
    .superRefine((data, ctx) => {
        if (data.type === 'event' && !data.selectedMembership) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please select a membership for event type',
                path: ['selectedMembership'],
            })
        }
    })

interface Lead {
    id: number
    name: string
    email: string
    phone: string
    event_id: number | null
    registered_date: string | null
    membership_active: boolean
    form_identifier: string | null
    host_id: number
    token: string
    created_at: string
    updated_at: string
    status_identifier: string
    lead_status: string | null
    dates: string | null
    source_url: string | null
    membership_level: string | null
    tags?: {
        id: number
        tag: string
        created_at: string
        updated_at: string
        host_id: number
    }
}

interface Tag {
    id: number
    host_id: number
    tag: string
    created_at: string
    updated_at: string
}

type SearchResult = Lead | EventWithDetails | Tag

interface SearchResponse {
    search_by: string
    search_value: string
    results: SearchResult[]
}

type SearchType = 'name' | 'tag' | 'event'

const MailEditor = ({
    events,
    tags,
}: {
    events: EventWithDetails[]
    tags: Tag[]
}) => {
    const { mail, messageDialog, toggleMessageDialog } = useMailStore()
    const [formSubmiting, setFormSubmiting] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchLoading, setSearchLoading] = useState(false)

    const { fetchMails } = useMail()
    const query = useQuery()

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleSearch = async (inputValue: string) => {
        if (!inputValue || typeof inputValue !== 'string') return

        setSearchLoading(true)
        try {
            const searchType = (watch('type') || 'name') as SearchType
            const response = (await apiSearchMails({
                search_by: searchType,
                search_value: inputValue.toLowerCase(),
            })) as SearchResponse

            if (response?.results) {
                setSearchResults(response.results)
            }
        } catch (error) {
            console.error('Error searching:', error)
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
            )
        } finally {
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        if (messageDialog.mode === 'reply') {
            reset({
                title: `Re:${mail?.title}`,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageDialog.mode])

    const handleDialogClose = () => {
        toggleMessageDialog({
            mode: '',
            open: false,
        })
        reset({
            title: '',
            content: '',
            type: 'name',
            filterType: 'everyone',
            recipients: null,
            selectedMembership: null,
        })
        setSearchResults([])
    }

    const onSubmit = async (value: FormSchema) => {
        setFormSubmiting(true)
        try {
            const payload = {
                subject: value.title,
                title: value.title,
                subtitle: value.title,
                body: value.content,
                button_text: 'DEFAULT_BUTTON_TEXT',
                type: value.type,
                filterType: value.filterType,
                button_link: 'https://example.com',
                recipients: value.recipients ? [value.recipients] : [],
                ...(value.selectedMembership && {
                    selectedMembership: value.selectedMembership,
                }),
            }

            const response = (await apiCreateMail(
                payload,
            )) as MailCreateResponse

            toast.push(
                <Notification type="success">
                    Your Message was sent successfuly! {response.count} emails
                    were sent
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            // Refresh the mail list with current category and label
            const category = query.get('category') || ''
            const label = query.get('label') || ''
            await fetchMails({ category, label })
        } catch (error) {
            console.error('Error creating mail:', error)
            const errorMessage = (error as AxiosError).message
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
            )
        }

        setFormSubmiting(false)
        handleDialogClose()
    }

    return (
        <Dialog
            width={700}
            isOpen={messageDialog.open}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4 className="mb-4 px-1">
                {messageDialog.mode === 'new' && 'New Message'}
                {messageDialog.mode === 'reply' && 'Reply'}
            </h4>
            <div className="max-h-200 overflow-y-auto px-1">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Type"
                        invalid={Boolean(errors.type)}
                        errorMessage={errors.type?.message}
                    >
                        <Controller
                            name="type"
                            control={control}
                            defaultValue="name"
                            render={({ field }) => (
                                <div className="flex">
                                    <Radio
                                        className="mr-8"
                                        name="type"
                                        checked={field.value === 'event'}
                                        onChange={() => {
                                            field.onChange('event')
                                            // Clear recipients when type changes

                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'event',
                                                filterType: 'everyone',
                                                recipients: null,
                                                selectedMembership: null,
                                            })
                                        }}
                                    >
                                        Event
                                    </Radio>
                                    <Radio
                                        className="mr-8"
                                        name="type"
                                        checked={field.value === 'tag'}
                                        onChange={() => {
                                            field.onChange('tag')

                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'tag',
                                                filterType: 'everyone',
                                                recipients: null,
                                                selectedMembership: null,
                                            })
                                        }}
                                    >
                                        Tag
                                    </Radio>
                                    <Radio
                                        className="mr-8"
                                        name="type"
                                        checked={field.value === 'name'}
                                        onChange={() => {
                                            field.onChange('name')

                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'name',
                                                filterType: 'everyone',
                                                recipients: null,
                                                selectedMembership: null,
                                            })
                                        }}
                                    >
                                        Name
                                    </Radio>
                                </div>
                            )}
                        />
                    </FormItem>
                    {watch('type') === 'event' && (
                        <FormItem
                            label="Filter by"
                            invalid={Boolean(errors.filterType)}
                            errorMessage={errors.filterType?.message}
                        >
                            <Controller
                                name="filterType"
                                control={control}
                                defaultValue="everyone"
                                render={({ field }) => (
                                    <div className="flex">
                                        <Radio
                                            className="mr-8"
                                            name="filterType"
                                            checked={field.value === 'everyone'}
                                            onChange={() => {
                                                field.onChange('everyone')
                                            }}
                                        >
                                            Everyone
                                        </Radio>
                                        <Radio
                                            className="mr-8"
                                            name="filterType"
                                            checked={field.value === 'attended'}
                                            onChange={() => {
                                                field.onChange('attended')
                                            }}
                                        >
                                            Attended Event
                                        </Radio>
                                        <Radio
                                            className="mr-8"
                                            name="filterType"
                                            checked={
                                                field.value === 'notAttended'
                                            }
                                            onChange={() => {
                                                field.onChange('notAttended')
                                            }}
                                        >
                                            Not Attended Event
                                        </Radio>
                                    </div>
                                )}
                            />
                        </FormItem>
                    )}
                    <FormItem
                        label={
                            watch('type') === 'tag'
                                ? 'Tags'
                                : watch('type') === 'event'
                                  ? 'Events'
                                  : 'Recipients'
                        }
                        invalid={Boolean(errors.recipients)}
                        errorMessage={errors.recipients?.message}
                    >
                        <Controller
                            name="recipients"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isLoading={searchLoading}
                                    placeholder={
                                        watch('type') === 'tag'
                                            ? 'Type to search tags'
                                            : watch('type') === 'event'
                                              ? 'Type to search events'
                                              : 'Type to search recipients'
                                    }
                                    options={(() => {
                                        const currentType = watch('type')

                                        // If type is 'event', use events prop
                                        if (currentType === 'event') {
                                            return events.map((event) => ({
                                                value: event.event.id,
                                                label: event.event.event_name,
                                                title: event.event
                                                    .event_description,
                                            }))
                                        }

                                        // If type is 'tag', use tags prop
                                        if (currentType === 'tag') {
                                            return tags.map((tag) => ({
                                                value: tag.id,
                                                label: tag.tag,
                                                title: tag.tag,
                                            }))
                                        }

                                        // For 'name' type, use search results
                                        return searchResults.reduce<
                                            {
                                                value: number
                                                label: string
                                                title: string
                                            }[]
                                        >((acc, result) => {
                                            if ('name' in result) {
                                                // It's a Lead
                                                const option = {
                                                    value: result.id,
                                                    label: `${result.name} - ${result.email}`,
                                                    title: `${result.name} - ${result.email}`,
                                                }
                                                // Only add if email is not already in the accumulator
                                                if (
                                                    !acc.some((item) =>
                                                        item.title.includes(
                                                            result.email,
                                                        ),
                                                    )
                                                ) {
                                                    acc.push(option)
                                                }
                                            }
                                            return acc
                                        }, [])
                                    })()}
                                    onInputChange={(inputValue) => {
                                        if (
                                            typeof inputValue === 'string' &&
                                            watch('type') === 'name'
                                        ) {
                                            handleSearch(inputValue)
                                        }
                                    }}
                                    onChange={(
                                        selected: SingleValue<{
                                            value: number
                                            label: string
                                        }>,
                                    ) => {
                                        field.onChange(selected?.value || null)
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    {watch('type') === 'event' &&
                        watch('recipients') !== null && (
                            <FormItem
                                label="Date"
                                invalid={Boolean(errors.selectedMembership)}
                                errorMessage={
                                    errors.selectedMembership?.message
                                }
                            >
                                <Controller
                                    name="selectedMembership"
                                    control={control}
                                    render={({ field }) => {
                                        // Get the selected event to show its memberships
                                        const selectedEventId =
                                            watch('recipients')

                                        const selectedEvent = events.find(
                                            (event) =>
                                                selectedEventId ===
                                                event.event.id,
                                        )

                                        if (
                                            !selectedEvent?.memberships ||
                                            selectedEvent.memberships.length ===
                                                0
                                        ) {
                                            return (
                                                <div className="text-gray-500">
                                                    No memberships available for
                                                    this event
                                                </div>
                                            )
                                        }

                                        // Create options for the select
                                        const membershipOptions =
                                            selectedEvent.memberships.map(
                                                (membership) => ({
                                                    value: membership.id,
                                                    label: `${dayjs
                                                        .unix(
                                                            Number(
                                                                membership
                                                                    .dates[0]
                                                                    .date,
                                                            ),
                                                        )
                                                        .format(
                                                            'ddd, DD MMM YYYY',
                                                        )} - ${membership.name}`,
                                                }),
                                            )

                                        return (
                                            <Select
                                                options={membershipOptions}
                                                value={membershipOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        field.value,
                                                )}
                                                placeholder="Choose date"
                                                isClearable={true}
                                                onChange={(selected) => {
                                                    field.onChange(
                                                        selected?.value || null,
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </FormItem>
                        )}
                    <FormItem
                        label="Title"
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder="Add a subject"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Message"
                        invalid={Boolean(errors.content)}
                        errorMessage={errors.content?.message}
                    >
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value}
                                    invalid={Boolean(errors.content)}
                                    onChange={({ html }) => {
                                        field.onChange(html)
                                    }}
                                />
                            )}
                        />
                    </FormItem>

                    <div className="text-right mt-4">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            type="button"
                            onClick={handleDialogClose}
                        >
                            Discard
                        </Button>
                        <Button
                            variant="solid"
                            loading={formSubmiting}
                            type="submit"
                        >
                            Send
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default MailEditor
