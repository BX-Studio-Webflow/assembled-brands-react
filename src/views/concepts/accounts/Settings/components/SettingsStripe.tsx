import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { PiLightningFill } from 'react-icons/pi'

import { apiInitateStripeConnect } from '@/services/AuthService'
import { useAuth } from '@/auth'
import { AxiosError } from 'axios'

const SettingsStripe = () => {
    const { user } = useAuth()

    const handleStripeConnect = async () => {
        try {
            const response = await apiInitateStripeConnect()
            window.open(response.url, '_blank')
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
            <h4 className="mb-4">Stripe</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <Avatar
                                className="bg-emerald-500"
                                shape="circle"
                                icon={<PiLightningFill />}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">Stripe</h6>
                                <Tag
                                    className={
                                        user?.stripe_connect_id
                                            ? 'bg-success-subtle text-success rounded-md border-0'
                                            : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                                    }
                                >
                                    <span className="capitalize">
                                        {user?.stripe_connect_id
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </Tag>
                            </div>
                            <div className="font-semibold mt-1">
                                <span>
                                    {user?.stripe_connect_id
                                        ? 'Connected'
                                        : 'Unconnected'}
                                </span>
                                <span> | </span>
                                <span>
                                    {user?.stripe_connect_id
                                        ? 'All set for payouts'
                                        : 'Please link your account'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {user?.stripe_connect_id ? (
                            <></>
                        ) : (
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={handleStripeConnect}
                            >
                                Connect account
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsStripe
