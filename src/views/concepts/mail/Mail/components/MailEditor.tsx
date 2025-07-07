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
import type { MultiValue } from 'react-select'
import useMail from '../hooks/useMail'
import useQuery from '@/utils/hooks/useQuery'

type FormSchema = {
    content: string
    title: string
    type: string
    recipients: number[]
}

const validationSchema: ZodType<FormSchema> = z.object({
    title: z.string().min(1, { message: 'Please enter title' }),
    content: z.string().min(1, { message: 'Please enter message' }),
    type: z.string(),
    recipients: z.array(z.number()),
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

interface Event {
    id: number
    event_name: string
    event_description: string
    event_type: string
    asset_id: number
    created_at: string
    status: string
    live_video_url: string
    success_url: string
    instructions: string
    landing_page_url: string
    calendar_url: string | null
    live_venue_address: string
    updated_at: string
    host_id: number
}

interface Tag {
    id: number
    host_id: number
    tag: string
    created_at: string
    updated_at: string
}

type SearchResult = Lead | Event | Tag

interface SearchResponse {
    search_by: string
    search_value: string
    results: SearchResult[]
}

type SearchType = 'name' | 'tag' | 'event'

const MailEditor = () => {
    const { mail, messageDialog, toggleMessageDialog } = useMailStore()
    const [formSubmiting, setFormSubmiting] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<
        { value: number; label: string }[]
    >([])

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
            recipients: [],
        })
        setSelectedOptions([])
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
                button_link: 'https://example.com',
                recipients: value.recipients,
            }
            await apiCreateMail(payload)
            toast.push(
                <Notification type="success">
                    Your Message was sent successfuly!
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
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
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
            <h4 className="mb-4">
                {messageDialog.mode === 'new' && 'New Message'}
                {messageDialog.mode === 'reply' && 'Reply'}
            </h4>
            <div className="max-h-200 overflow-y-auto">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Type:"
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
                                            setSelectedOptions([])
                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'event',
                                                recipients: [],
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

                                            // Clear recipients when type changes
                                            setSelectedOptions([])
                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'tag',
                                                recipients: [],
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
                                            // Clear recipients when type changes
                                            setSelectedOptions([])
                                            setSearchResults([])
                                            // Reset the recipients field in the form
                                            reset({
                                                title: watch('title') || '',
                                                content: watch('content') || '',
                                                type: 'name',
                                                recipients: [],
                                            })
                                        }}
                                    >
                                        Name
                                    </Radio>
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Recipients:"
                        invalid={Boolean(errors.recipients)}
                        errorMessage={errors.recipients?.message}
                    >
                        <Controller
                            name="recipients"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isMulti
                                    isLoading={searchLoading}
                                    placeholder="Type to search recipients"
                                    value={selectedOptions}
                                    options={searchResults.reduce<
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
                                        } else if ('event_name' in result) {
                                            // It's an Event
                                            const option = {
                                                value: result.id,
                                                label: result.event_name,
                                                title: result.event_description,
                                            }
                                            // Only add if event name is not already in the accumulator
                                            if (
                                                !acc.some(
                                                    (item) =>
                                                        item.label ===
                                                        result.event_name,
                                                )
                                            ) {
                                                acc.push(option)
                                            }
                                        } else if ('tag' in result) {
                                            // It's a Tag
                                            const option = {
                                                value: result.id,
                                                label: result.tag,
                                                title: result.tag,
                                            }
                                            // Only add if tag name is not already in the accumulator
                                            if (
                                                !acc.some(
                                                    (item) =>
                                                        item.label ===
                                                        result.tag,
                                                )
                                            ) {
                                                acc.push(option)
                                            }
                                        }
                                        return acc
                                    }, [])}
                                    onInputChange={(inputValue) => {
                                        if (typeof inputValue === 'string') {
                                            handleSearch(inputValue)
                                        }
                                    }}
                                    onChange={(
                                        selected: MultiValue<{
                                            value: number
                                            label: string
                                        }>,
                                    ) => {
                                        const values = selected.map(
                                            (option) => option.value,
                                        )
                                        field.onChange(values)
                                        setSelectedOptions([...selected])
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Title:"
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
