
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import { TbMessageCircleCheck } from 'react-icons/tb'
import type { GetSettingsProfileResponse } from '../types'
import { Button, Input, Notification, toast, Checkbox } from '@/components/ui'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { apiUpdateSettingsNotification } from '@/services/AuthService'
import { UpdateSettingsNotificationBody } from '@/@types/auth'


type FormSchema = {
    followUpEnabled: boolean
    postEventEnabled: boolean
    followUpTemplateMode: 'default' | 'custom'
    postEventTemplateMode: 'default' | 'custom'
    followUpWhoGetsIt: (
     
        | 'new_lead'
        | 'call_back'
        | 'registered_for_event'
        | 'attended_event'
    )[]
    postEventWhoGetsIt: (
       
        | 'new_lead'
        | 'call_back'
        | 'registered_for_event'
        | 'attended_event'
    )[]
    followUpCustomTemplate: string
    postEventCustomTemplate: string
}

const validationSchema = z.object({
    followUpEnabled: z.boolean(),
    postEventEnabled: z.boolean(),
    followUpTemplateMode: z.enum(['default', 'custom']),
    postEventTemplateMode: z.enum(['default', 'custom']),
    followUpWhoGetsIt: z.array(z.enum([ 'new_lead', 'call_back', 'registered_for_event', 'attended_event'])),
    postEventWhoGetsIt: z.array(z.enum(['new_lead', 'call_back', 'registered_for_event', 'attended_event'])),
    followUpCustomTemplate: z.string().optional(),
    postEventCustomTemplate: z.string().optional(),
})

const followUpTemplateOptions: {
    label: string
    value: 'default' | 'custom'
    desc: string
}[] = [
    {
        label: 'Use default template',
        value: 'default',
        desc: 'Broadcast notifications to the leads using the default template',
    },
    {
        label: 'Use custom template',
        value: 'custom',
        desc: 'Broadcast notifications to the leads using the custom template',
    },
    
]

const leadOptions = [
    {
        label: 'New Lead',
        value: 'new_lead',
    },
    {
        label: 'Call Back',
        value: 'call_back',
    },
    {
        label: 'Registered for Event',
        value: 'registered_for_event',
    },
    {
        label: 'Attended Event',
        value: 'attended_event',
    },
]

type SettingsNotificationProps = {
    data: GetSettingsProfileResponse
    mutate: () => void
}

const SettingsNotification = ({ data, mutate }: SettingsNotificationProps) => {
   

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            followUpEnabled: data.user.is_follow_up_emails_enabled || false,
            postEventEnabled: data.user.is_post_event_emails_enabled || false,
            followUpTemplateMode: data.user.follow_up_template_mode || 'default',
            postEventTemplateMode: data.user.post_event_template_mode || 'default',
            followUpCustomTemplate: data.user.follow_up_template || '',
            postEventCustomTemplate: data.user.post_event_template || '',
            followUpWhoGetsIt: Array.isArray(data.user.follow_up_who_gets_it)
                ? (data.user.follow_up_who_gets_it as FormSchema['followUpWhoGetsIt'])
                : (['new_lead'] as FormSchema['followUpWhoGetsIt']),
            postEventWhoGetsIt: Array.isArray(data.user.post_event_who_gets_it)
                ? (data.user.post_event_who_gets_it as FormSchema['postEventWhoGetsIt'])
                : (['new_lead'] as FormSchema['postEventWhoGetsIt']),
        },
        resolver: zodResolver(validationSchema),
    })

    const followUpTemplateMode = watch('followUpTemplateMode')
    const postEventTemplateMode = watch('postEventTemplateMode')
    const isFollowUpEmailsEnabled = watch('followUpEnabled')
    const isPostEventEmailsEnabled = watch('postEventEnabled')

	// Handlers removed - form state is managed by react-hook-form

    const onSubmit: SubmitHandler<FormSchema> = async (values) => {
        console.log('Form submitted:', values)
        try {
			const body: UpdateSettingsNotificationBody = {
				is_follow_up_emails_enabled: values.followUpEnabled || false,
				is_post_event_emails_enabled: values.postEventEnabled || false,
				follow_up_template_mode: values.followUpTemplateMode,
				post_event_template_mode: values.postEventTemplateMode,
				follow_up_template: values.followUpCustomTemplate,
				post_event_template: values.postEventCustomTemplate,
				follow_up_who_gets_it: values.followUpWhoGetsIt || ['all'],
				post_event_who_gets_it: values.postEventWhoGetsIt || ['all'],
			}
            await apiUpdateSettingsNotification(body)
            toast.push(
                
					<Notification type="success">
						Notification settings updated successfully!
					</Notification>,
					{ placement: 'top-center' },
				)
            
            mutate()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <div>
            <h4>Notification</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-2">
				<div className="py-6 border-b border-gray-200 dark:border-gray-600">
					<div className="flex items-center justify-between">
						<div>
							<h5>Enable follow up emails</h5>
							<p>
								Decide whether you want to attended leads to be notified a day after the event.
							</p>
						</div>
						<div>
						<Controller
							name="followUpEnabled"
							control={control}
							render={({ field }) => (
								<Switcher
									checked={field.value || false}
									onChange={field.onChange}
								/>
							)}
						/>
						</div>
					</div>
					{isFollowUpEmailsEnabled && (
                        <div className="flex flex-col gap-4">
						<div className="mt-4">
							
							<Controller
								name="followUpTemplateMode"
								control={control}
								render={({ field }) => (
									<Radio.Group
										vertical
										className="flex flex-col gap-6"
										value={field.value}
										onChange={field.onChange}
									>
								{followUpTemplateOptions.map((option) => (
									<div key={option.value} className="flex gap-4">
										<div className="mt-1.5">
											<Radio value={option.value} />
										</div>
										<div className="flex gap-2">
											<div className="mt-1">
												<TbMessageCircleCheck className="text-lg" />
											</div>
											<div>
												<h6>{option.label}</h6>
												<p>{option.desc}</p>
											</div>
										</div>
									</div>
								))}
									</Radio.Group>
								)}
							/>
						</div>
						{followUpTemplateMode === 'custom' && (
							<div>
							<FormItem
								label="Custom Follow-up Template"
								invalid={Boolean(errors.followUpCustomTemplate)}
								errorMessage={errors.followUpCustomTemplate?.message}
							>
								<Controller
									name="followUpCustomTemplate"
									control={control}
									render={({ field }) => (
										<Input
											textArea
											placeholder="Enter your custom template"
											style={{ minHeight: 300 }}
											{...field}
										/>
									)}
								/>
							</FormItem>
							<FormItem label="Who gets it?">
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
						</div>
						)}
                    </div>
					)}
				</div>
				<div className="py-6 border-b border-gray-200 dark:border-gray-600">
					<div className="flex items-center justify-between">
						<div>
							<h5>Enable post event emails</h5>
							<p>
							Decide whether you want registered leads to be notified 3 days after the event.
							
							</p>
						</div>
						<div>
						<Controller
							name="postEventEnabled"
							control={control}
							render={({ field }) => (
								<Switcher
									checked={field.value || false}
									onChange={field.onChange}
								/>
							)}
						/>
						</div>
					</div>
					{isPostEventEmailsEnabled && (
                        <div className="flex flex-col gap-4">
						<div className="mt-4">
						
							
							</div>
							<div>
							<Controller
								name="postEventTemplateMode"
								control={control}
								render={({ field }) => (
									<Radio.Group
										vertical
										className="flex flex-col gap-6"
										value={field.value}
										onChange={field.onChange}
									>
								{followUpTemplateOptions.map((option) => (
									<div key={option.value} className="flex gap-4">
										<div className="mt-1.5">
											<Radio value={option.value} />
										</div>
										<div className="flex gap-2">
											<div className="mt-1">
												<TbMessageCircleCheck className="text-lg" />
											</div>
											<div>
												<h6>{option.label}</h6>
												<p>{option.desc}</p>
											</div>
										</div>
									</div>
								))}
									</Radio.Group>
								)}
							/>
						</div>
						{postEventTemplateMode === 'custom' && (
							<div>
							<FormItem
								label="Custom Post-event Template"
								invalid={Boolean(errors.postEventCustomTemplate)}
								errorMessage={errors.postEventCustomTemplate?.message}
							>
								<Controller
									name="postEventCustomTemplate"
									control={control}
									render={({ field }) => (
										<Input
											textArea
											placeholder="Enter your custom template"
											style={{ minHeight: 300 }}
											{...field}
										/>
									)}
								/>
							</FormItem>
							<FormItem label="Who gets it?">
							<Controller
								name="postEventWhoGetsIt"
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
							</div>
						)}
						
                    </div>
					)}
					
				</div>
                <FormItem>
                <div className="flex justify-end mt-4">
                <Button variant="solid" type="submit">
                    Save Changes
                </Button>
                </div>
            </FormItem>
            </div>
            </Form>
        </div>
    )
}

export default SettingsNotification
