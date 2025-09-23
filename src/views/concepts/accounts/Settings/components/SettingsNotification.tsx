
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import cloneDeep from 'lodash/cloneDeep'
import { TbMessageCircleCheck } from 'react-icons/tb'
import type { GetSettingsProfileResponse } from '../types'
import { Button, Input, Notification, toast } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { apiUpdateSettingsNotification } from '@/services/AuthService'


type FormSchema = {
    followUpTemplate: string
    postEventTemplate: string
    followUpCustomTemplate: string
    postEventCustomTemplate: string
}

const validationSchema = z.object({
    followUpTemplate: z.string().min(1, { message: 'Template selection required' }),
    postEventTemplate: z.string().min(1, { message: 'Template selection required' }),
    followUpCustomTemplate: z.string().optional(),
    postEventCustomTemplate: z.string().optional(),
})

const followUpTemplateOptions: {
    label: string
    value: string
    desc: string
}[] = [
    {
        label: 'Use default template',
        value: 'useDefaultTemplate',
        desc: 'Broadcast notifications to the leads using the default template',
    },
    {
        label: 'Use custom template',
        value: 'useCustomTemplate',
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
            followUpTemplate: data.user.follow_up_template || '',
            postEventTemplate: data.user.post_event_template || '',
            followUpCustomTemplate: '',
            postEventCustomTemplate: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const followUpTemplate = watch('followUpTemplate')
    const postEventTemplate = watch('postEventTemplate')

	// Derived, clearly named view variables
	const isFollowUpEmailsEnabled = data.user.is_follow_up_emails_enabled
	const isPostEventEmailsEnabled = data.user.is_post_event_emails_enabled

	const handleFollowUpToggle = (value: boolean) => {
        const newData = cloneDeep(data)
        newData.user.is_follow_up_emails_enabled = value
        mutate()
    }

	const handlePostEventToggle = (value: boolean) => {
        const newData = cloneDeep(data)
        newData.user.is_post_event_emails_enabled = value
        mutate()
    }

	const handleFollowUpTemplateChange = (value: string) => {
        const newData = cloneDeep(data)
        newData.user.follow_up_template = value
        mutate()
    }

    const handlePostEventTemplateChange = (value: string) => {
        const newData = cloneDeep(data)
        newData.user.post_event_template = value
        mutate()
    }

    const onSubmit = async (values: FormSchema) => {
        console.log('Form submitted:', values)
        try {
            await apiUpdateSettingsNotification(values)
            toast.push(
                
					<Notification type="success">
						Business details updated successfully!
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
						<Switcher
							checked={isFollowUpEmailsEnabled}
							onChange={handleFollowUpToggle}
						/>
						</div>
					</div>
					{isFollowUpEmailsEnabled && (
                        <div className="flex flex-col gap-4">
						<div className="mt-4">
							<Radio.Group
								vertical
								className="flex flex-col gap-6"
								value={followUpTemplate}
								onChange={handleFollowUpTemplateChange}
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
						</div>
						{followUpTemplate === 'useCustomTemplate' && (
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
						<Switcher
							checked={isPostEventEmailsEnabled}
							onChange={handlePostEventToggle}
						/>
						</div>
					</div>
					{isPostEventEmailsEnabled && (
                        <div className="flex flex-col gap-4">
						<div className="mt-4">
							<Radio.Group
								vertical
								className="flex flex-col gap-6"
								value={postEventTemplate}
								onChange={handlePostEventTemplateChange}
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
						</div>
						{postEventTemplate === 'useCustomTemplate' && (
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
