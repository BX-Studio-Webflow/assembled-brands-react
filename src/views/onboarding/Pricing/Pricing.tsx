import Card from '@/components/ui/Card'
import Plans from './components/Plans'
import PaymentCycleToggle from './components/PaymentCycleToggle'
import Faq from './components/Faq'
import PaymentDialog from './components/PaymentDialog'
import { useEffect } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const Pricing = () => {
    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const action = urlParams.get('action')
        if (action === 'add-subscription') {
            toast.push(
                <Notification type="danger">
                    Your subscription is not active. Please add a subscription
                    to continue using the platform.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }, [])
    return (
        <>
            <Card className="mb-4 mt-10 mr-10 ml-10">
                <div className="flex items-center justify-between mb-8">
                    <h3>Pricing</h3>
                    <PaymentCycleToggle />
                </div>
                <Plans />
            </Card>
            <Faq />
            <PaymentDialog />
        </>
    )
}

export default Pricing
