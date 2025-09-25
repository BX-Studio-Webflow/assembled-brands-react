import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { apiCreateFollowUpEmail } from '@/services/MailService'
import { AxiosError } from 'axios'



import Checkbox from '@/components/ui/Checkbox'
import { CreateBulkMailBody } from '@/@types/mail'
import { useAuth } from '@/auth'


type FormSchema = {
   
    content: string
    title: string
    timeline: number | null
    followUpWhoGetsIt: (
        | 'new_lead'
    | 'call_back'
    | 'registered_for_event'
    | 'attended_event'
    )[]
}

const leadOptions = [
    {
        label: 'New Lead',
        value: 'new_lead',
    },
	{
        label: 'Registered for Event',
        value: 'registered_for_event',
    },
	{
        label: 'Attended Event',
        value: 'attended_event',
    },
    {
        label: 'Call Back',
        value: 'call_back',
    },   
   
]

const validationSchema: ZodType<FormSchema> = z
    .object({
        title: z.string().min(1, { message: 'Please enter title' }),
        content: z.string().min(1, { message: 'Please enter message' }),
       
        followUpWhoGetsIt: z.array(z.enum(['new_lead', 'call_back', 'registered_for_event', 'attended_event'])),    
       
        timeline: z.number().min(1, { message: 'Please enter a valid timeline' }).nullable(),
       
    })


    interface NewBulkMailProps {
        setShowNewBulkMail: (show: boolean) => void
    }

const NewBulkMail = ({ setShowNewBulkMail }: NewBulkMailProps) => {
    const [showNewBulkMail, setShowNewBulkMailLocal] = useState(true)
    const [formSubmiting, setFormSubmiting] = useState(false)
    const { user } = useAuth()
   
   

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,

    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
    })


   

    const handleDialogClose = () => {
        setShowNewBulkMailLocal(false)
        setShowNewBulkMail(false)
        reset({
           
            title: '',
            content: '',
           
            timeline: null,
            followUpWhoGetsIt: [],
        })
    }

    const onSubmit = async (value: FormSchema) => {
        setFormSubmiting(true)
        try {
			const body: CreateBulkMailBody = {
				title: value.title,
				content: value.content,
				follow_up_who_gets_it: value.followUpWhoGetsIt || [],
				timeline: value.timeline || 0,
				user_id: user?.id || 0,
			}
            await apiCreateFollowUpEmail(body)
            toast.push(
                
					<Notification type="success">
						Follow up email created successfully!
					</Notification>,
					{ placement: 'top-center' },
				)
            
           
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }

        setFormSubmiting(false)
        handleDialogClose()
    }

    return (
        <Dialog
            width={700}
            isOpen={showNewBulkMail}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4 className="mb-4 px-1">
                {showNewBulkMail && 'New Bulk Mail'}
            </h4>
            <div className="max-h-200 overflow-y-auto px-1">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    
                    
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

                    <FormItem
                        label="Timeline (days)"
                        invalid={Boolean(errors.timeline)}
                        errorMessage={errors.timeline?.message}
                    >
                        <Controller
                            name="timeline"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Enter timeline in days"
                                    min="1"
                                    max="10"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        field.onChange(value ? parseInt(value, 10) : null)
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem 
								label="Who gets it?"
								invalid={Boolean(errors.followUpWhoGetsIt)}
								errorMessage={errors.followUpWhoGetsIt?.message}
							>
							<Controller
								name="followUpWhoGetsIt"
								control={control}
								render={({ field }) => (
									<Checkbox.Group value={field.value} onChange={field.onChange}>
										{leadOptions.map((opt) => (
											<Checkbox key={opt.value} value={opt.value}>
												{opt.label}
											</Checkbox>
										))}
									</Checkbox.Group>
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
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default NewBulkMail
