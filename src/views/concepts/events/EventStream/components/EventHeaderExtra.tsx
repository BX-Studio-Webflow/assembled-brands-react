import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { useEvent } from '../context/EventContext'
import { apiSaveInstantCallback } from '@/services/EventService'
import { toast } from '@/components/ui'
import { Notification } from '@/components/ui/Notification'
import { AxiosError } from 'axios'
import ChatStats from '@/views/concepts/chat/Chat/components/ChatStats'
import { useState, type MouseEvent } from 'react'
import { IoStatsChart } from 'react-icons/io5'

interface EventHeaderExtraProps {
    isHost: boolean
    eventStatus: 'live' | 'ended' | 'early' | 'cancelled' | 'suspended'
}

const EventHeaderExtra = ({ isHost, eventStatus }: EventHeaderExtraProps) => {
    const { data } = useEvent()
    const [dialogIsOpen, setIsOpen] = useState(false)

    if (!data) {
        return <></>
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
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

    return isHost && eventStatus === 'live' ? (
        <>
            <div className="flex items-center gap-2 print:hidden mr-8">
                <Button
                    className="mr-2"
                    icon={<IoStatsChart />}
                    onClick={openDialog}
                >
                    <span>
                        <span>Who&apos;s watching?</span>
                    </span>
                </Button>
            </div>
            <Dialog
                isOpen={dialogIsOpen}
                style={{
                    content: {
                        marginTop: 50,
                        width: '70%',
                    },
                }}
                contentClassName="pb-0 px-0"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="px-6 pb-6">
                    <div className="w-full mt-8">
                        <ChatStats eventId={data.event.id} isHost={isHost} />
                    </div>
                </div>
                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={onDialogClose}
                    >
                        Close
                    </Button>
                </div>
            </Dialog>
        </>
    ) : (
        <div className="flex items-center gap-2 print:hidden mr-8">
            {eventStatus === 'live' ||
                (eventStatus === 'ended' && (
                    <Button
                        variant="solid"
                        customColorClass={() =>
                            'bg-green-400 hover:bg-green-500 text-white'
                        }
                        onClick={() => handleInstantCallback()}
                    >
                        Instant Call Back
                    </Button>
                ))}
            {(eventStatus === 'live' || eventStatus === 'ended') &&
                data.event.calendar_url && (
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
            {(eventStatus === 'live' || eventStatus === 'ended') &&
                data.event.calendar_url && (
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
