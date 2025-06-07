import Button from '@/components/ui/Button'
import { useEvent } from '../context/EventContext'
import { apiSaveInstantCallback } from '@/services/EventService'
import { useAuth } from '@/auth'
import { toast } from '@/components/ui'
import { Notification } from '@/components/ui/Notification'
import { AxiosError } from 'axios'

const EventHeaderExtra = () => {
    const { user } = useAuth()

    const { data } = useEvent()

    if (!data) {
        return <></>
    }
    const handleUpgradeClick = () => {
        window.open(`${data.event.calendar_url}`, '_blank')
    }

    const handleScheduleCallback = () => {
        window.open(`${data.event.calendar_url}`, '_blank')
    }

    const handleInstantCallback = async () => {
        try {
            await apiSaveInstantCallback({
                lead_id: user?.id || 0,
                event_id: data.event.id,
                callback_type: 'instant',
                notes: '',
                host_id: data.event.host_id || 0,
            })
            toast.push(
                <Notification type="success">
                    Callback saved successfully
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error: unknown) {
            const message = (error as AxiosError).message
            toast.push(<Notification type="danger">{message}</Notification>, {
                placement: 'top-center',
            })
        }
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-green-400 hover:bg-green-500 text-white'
                }
                onClick={() => handleInstantCallback()}
            >
                Instant Call Back
            </Button>
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-teal-400 hover:bg-teal-500 text-white'
                }
                onClick={() => handleScheduleCallback()}
            >
                Schedule a Call Back
            </Button>
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-amber-400 hover:bg-amber-500 text-white'
                }
                onClick={() => handleUpgradeClick()}
            >
                Upgrade Now
            </Button>
        </div>
    )
}

export default EventHeaderExtra
