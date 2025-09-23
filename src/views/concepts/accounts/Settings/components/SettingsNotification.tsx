
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import { TbMessageCircleCheck } from 'react-icons/tb'
import type { GetSettingsProfileResponse } from '../types'
import { Button, Input, Notification, toast } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
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
    followUpCustomTemplate: string
    postEventCustomTemplate: string
}

const validationSchema = z.object({
    followUpEnabled: z.boolean(),
    postEventEnabled: z.boolean(),
    followUpTemplateMode: z.enum(['default', 'custom']),
    postEventTemplateMode: z.enum(['default', 'custom']),
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
        },
        resolver: zodResolver(validationSchema),
    })

    const followUpTemplateMode = watch('followUpTemplateMode')
    const postEventTemplateMode = watch('postEventTemplateMode')
    const isFollowUpEmailsEnabled = watch('followUpEnabled')
    const isPostEventEmailsEnabled = watch('postEventEnabled')

	// Handlers removed - form state is managed by react-hook-form

    const onSubmit = async (values: FormSchema) => {
        console.log('Form submitted:', values)
        try {
			const body: UpdateSettingsNotificationBody = {
				is_follow_up_emails_enabled: values.followUpEnabled || false,
				is_post_event_emails_enabled: values.postEventEnabled || false,
				follow_up_template_mode: values.followUpTemplateMode,
				post_event_template_mode: values.postEventTemplateMode,
				follow_up_template: values.followUpCustomTemplate,
				post_event_template: values.postEventCustomTemplate,
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
