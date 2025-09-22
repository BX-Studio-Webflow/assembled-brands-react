import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import { apiGetSettingsNotification } from '@/services/AccontsService'
import useSWR from 'swr'
import cloneDeep from 'lodash/cloneDeep'
import { TbMessageCircleCheck } from 'react-icons/tb'
import type { GetSettingsNotificationResponse } from '../types'
import { Input } from '@/components/ui'

type EmailNotificationCategory =
    | 'newsAndUpdate'
    | 'tipsAndTutorial'
    | 'offerAndPromotion'
    | 'followUpReminder'


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

const SettingsNotification = () => {
    const {
        data = {
            email: [],
            desktop: false,
            unreadMessageBadge: false,
            notifymeAbout: '',
            postEventTemplate: '',
        },
        mutate,
    } = useSWR(
        '/api/settings/notification/',
        () => apiGetSettingsNotification<GetSettingsNotificationResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

	// Derived, clearly named view variables
	const isFollowUpEmailsEnabled = data.desktop
	const isPostEventEmailsEnabled = data.unreadMessageBadge
	const followUpTemplate = data.notifymeAbout
	const postEventTemplate = (data as any).postEventTemplate || ''

	const handleFollowUpToggle = (value: boolean) => {
        const newData = cloneDeep(data)
        newData.desktop = value
        mutate(newData, false)
    }

	const handlePostEventToggle = (value: boolean) => {
        const newData = cloneDeep(data)
        newData.unreadMessageBadge = value
        mutate(newData, false)
    }

	const handleFollowUpTemplateChange = (value: string) => {
        const newData = cloneDeep(data)
        newData.notifymeAbout = value
        mutate(newData, false)
    }

    const handlePostEventTemplateChange = (value: string) => {
        const newData = cloneDeep(data)
        ;(newData as any).postEventTemplate = value
        mutate(newData, false)
    }

    return (
        <div>
            <h4>Notification</h4>
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
							<div>
								<Input textArea placeholder="Enter your custom template" />
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
							<div>
								<Input textArea placeholder="Enter your custom template" />
							</div>
						)}
                    </div>
					)}
				</div>
                
            </div>
        </div>
    )
}

export default SettingsNotification
