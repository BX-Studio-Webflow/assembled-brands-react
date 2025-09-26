
import { Button } from '@/components/ui'
import { HiOutlineMail } from 'react-icons/hi'
import { useState } from 'react'
import NewBulkMail from './NewBulkMail'
import { apiGetFollowUpEmails } from '@/services/MailService'
import useSWR from 'swr'
import { FollowUpEmail } from '@/@types/mail'
import BulkMailListContent from './BulkMailListContent'
    



const SettingsNotification = () => {
	const [showNewBulkMail, setShowNewBulkMail] = useState(false)
    const { data, isLoading, mutate } = useSWR(
        ['/email/follow-up'],
       apiGetFollowUpEmails<FollowUpEmail[]>, {
            revalidateOnFocus: false,
        },
    )
    return (
        <div>
            <h4>Notification</h4>
            <div className="mt-2">
                <div className="py-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h5>Enable follow up emails</h5>
                            <p>
							Decide whether you want to leads to be notified after the event.
                            </p>
                        </div>
                        <div>
                            <Button className="mr-2" icon={<HiOutlineMail />} onClick={() => setShowNewBulkMail(true)}>
                                <span>Add follow up</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          
            {showNewBulkMail && (
                <NewBulkMail setShowNewBulkMail={setShowNewBulkMail} mutate={mutate} />
            )}
			{data && (
				<BulkMailListContent data={data} mutate={mutate} isLoading={isLoading} />
			)}
        </div>
    )
}

export default SettingsNotification
