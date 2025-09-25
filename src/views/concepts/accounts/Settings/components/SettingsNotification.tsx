
import { Button } from '@/components/ui'
import { HiOutlineMail } from 'react-icons/hi'
import { useState } from 'react'
import NewBulkMail from './NewBulkMail'




const SettingsNotification = () => {
	const [showNewBulkMail, setShowNewBulkMail] = useState(false)


    return (
        <div>
            <h4>Notification</h4>
            <div className="mt-2">
                <div className="py-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h5>Bulk Mail</h5>
                            <p>
                                Create and send bulk emails to your leads.
                            </p>
                        </div>
                        <div>
                            <Button onClick={() => setShowNewBulkMail(true)} className="mr-2" icon={<HiOutlineMail />}>
                                <span>New Bulk Mail</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          
            {showNewBulkMail && (
                <NewBulkMail setShowNewBulkMail={setShowNewBulkMail} />
            )}
        </div>
    )
}

export default SettingsNotification
