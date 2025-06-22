import Button from '@/components/ui/Button'
import { useEvent } from '../context/EventContext'
import { apiSaveInstantCallback } from '@/services/EventService'
import { toast } from '@/components/ui'
import { Notification } from '@/components/ui/Notification'
import { AxiosError } from 'axios'

interface EventHeaderExtraProps {
    isHost: boolean
}

const EventHeaderExtra = ({ isHost }: EventHeaderExtraProps) => {
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
                lead_id: data.lead?.id || 0,
                event_id: data.event.id,
                callback_type: 'instant',
                notes: `Hi, this is ${data.lead?.name} from ${data.lead?.email}. Please call me back.`,
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

    return isHost ? (
        <></>
    ) : (
        <div className="flex items-center gap-2 print:hidden mr-8">
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-green-400 hover:bg-green-500 text-white'
                }
                onClick={() => handleInstantCallback()}
            >
                Instant Call Back
            </Button>
            {data.event.calendar_url && (
                <Button
                    variant="solid"
                    customColorClass={() =>
                        'bg-teal-400 hover:bg-teal-500 text-white'
                    }
                    onClick={() => handleScheduleCallback()}
                >
                    Schedule a Call Back
                </Button>
            )}
            {data.event.calendar_url && (
                <Button
                    variant="solid"
                    customColorClass={() =>
                        'bg-amber-400 hover:bg-amber-500 text-white'
                    }
                    onClick={() => handleUpgradeClick()}
                >
                    Upgrade Now
                </Button>
            )}
        </div>
    )
}

export default EventHeaderExtra
