import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useMailStore } from '../store/mailStore'
import { FormItem, Form } from '@/components/ui/Form'
import sleep from '@/utils/sleep'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { apiCreateMail } from '@/services/MailService'
import { AxiosError } from 'axios'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'

type FormSchema = {
    to: string
    content: string
    title: string
    button_text: string
    button_link: string
    type: string
    recipients: number[]
}

const recipientOptions = [
    { value: 102, label: 'User 102' },
    { value: 180, label: 'User 180' },
]

const validationSchema: ZodType<FormSchema> = z.object({
    to: z.string().min(1, { message: 'Please enter recipient' }),
    title: z.string().min(1, { message: 'Please enter title' }),
    content: z.string().min(1, { message: 'Please enter message' }),
    button_text: z.string().min(1, { message: 'Please enter button text' }),
    button_link: z.string().url({ message: 'Please enter a valid URL' }),
    type: z.string(),
    recipients: z.array(z.number()),
})

const MailEditor = () => {
    const { mail, messageDialog, toggleMessageDialog } = useMailStore()

    const [formSubmiting, setFormSubmiting] = useState(false)

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (messageDialog.mode === 'reply') {
            reset({
                to: mail.from,
                title: `Re:${mail.title}`,
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
            to: '',
            title: '',
            content: '',
        })
    }

    const onSubmit = async (value: FormSchema) => {
        console.log('values', value)
        setFormSubmiting(true)
        await sleep(500)
        try {
            const payload = {
                subject: value.title,
                title: 'XXXXXXXXXXX',
                subtitle: '3TheMind',
                body: value.content,
                button_text: 'View Event',
                type: 'name',
                button_link: 'https://3themind.com',
                recipients: [102, 180], // TODO: Replace with actual recipient IDs
            }
            await apiCreateMail(payload)
            toast.push(
                <Notification type="success">
                    Your Mail was sent successfuly!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
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
            isOpen={messageDialog.open}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4 className="mb-4">
                {messageDialog.mode === 'new' && 'New Message'}
                {messageDialog.mode === 'reply' && 'Reply'}
            </h4>
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
                                    onChange={() => field.onChange('event')}
                                >
                                    Event
                                </Radio>
                                <Radio
                                    className="mr-8"
                                    name="type"
                                    checked={field.value === 'tag'}
                                    onChange={() => field.onChange('tag')}
                                >
                                    Tag
                                </Radio>
                                <Radio
                                    className="mr-8"
                                    name="type"
                                    checked={field.value === 'name'}
                                    onChange={() => field.onChange('name')}
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
                        defaultValue={[102, 180]}
                        render={({ field }) => (
                            <Select
                                isMulti
                                placeholder="Type to search recipients"
                                defaultValue={recipientOptions}
                                options={recipientOptions}
                                onChange={(selected) =>
                                    field.onChange(
                                        selected.map((option) => option.value),
                                    )
                                }
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
                    label="To:"
                    invalid={Boolean(errors.to)}
                    errorMessage={errors.to?.message}
                >
                    <Controller
                        name="to"
                        control={control}
                        render={({ field }) => (
                            <Input autoComplete="off" {...field} />
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
                <FormItem
                    label="Button Text:"
                    invalid={Boolean(errors.button_text)}
                    errorMessage={errors.button_text?.message}
                >
                    <Controller
                        name="button_text"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="Enter button text"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Redirect URL:"
                    invalid={Boolean(errors.button_link)}
                    errorMessage={errors.button_link?.message}
                >
                    <Controller
                        name="button_link"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="Enter redirect URL"
                                {...field}
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
        </Dialog>
    )
}

export default MailEditor
