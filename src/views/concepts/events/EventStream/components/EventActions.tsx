import React, { useEffect, useState, type MouseEvent } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import ChatStats from '@/views/concepts/chat/Chat/components/ChatStats'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import { IoStatsChart } from 'react-icons/io5'
import { apiCreateClick } from '@/services/ClickAnalyticsService'
import { useEvent } from '../context/EventContext'
import { apiSaveInstantCallback } from '@/services/EventService'
import { Badge, toast } from '@/components/ui'
import { Notification } from '@/components/ui/Notification'
import { AxiosError } from 'axios'
import { HiOutlineUser } from 'react-icons/hi'
import { apiGetTelemetryByEventId } from '@/services/TelemetryService'
import { GetTelemetryByEventIdResponse } from '@/@types/telemetry'

interface EventActionsProps {
    isHost: boolean
    eventStatus: 'live' | 'ended' | 'early' | 'cancelled' | 'suspended'
    eventId: number
}

const EventActions = ({ isHost, eventStatus, eventId }: EventActionsProps) => {
    const { data } = useEvent()
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [telemetryData, setTelemetryData] =
        useState<GetTelemetryByEventIdResponse>()
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

    const handleUpgradeClick = async () => {
        //track click
        await apiCreateClick({
            lead_id: data.lead?.id || 0,
            event_id: data.event.id,
            link_url: data.event.upgrade_url,
            click_type: 'upgrade',
        })
        window.open(`${data.event.upgrade_url}`, '_blank')
    }

    const handleScheduleCallback = async () => {
        //track click
        await apiCreateClick({
            lead_id: data.lead?.id || 0,
            event_id: data.event.id,
            link_url: data.event.calendar_url,
            click_type: 'schedule_callback',
        })
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

    //Fire on mount, then every 10 seconds
    useEffect(() => {
        // Only track telemetry for non-hosts
        if (!isHost) return

        const fetchTelemetry = async () => {
            try {
                const response = await apiGetTelemetryByEventId(Number(eventId))
                setTelemetryData(response)
            } catch (error) {
                console.error('Failed to get telemetry:', error)
            }
        }

        // Fire immediately on mount
        fetchTelemetry()

        // Then set up interval for every 10 seconds
        const interval = setInterval(fetchTelemetry, 10000)

        return () => clearInterval(interval)
    }, [eventId, isHost])

    return isHost && eventStatus === 'live' ? (
        <>
            <div className="flex items-center gap-2 print:hidden mr-2">
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
    ) : isHost && eventStatus === 'early' ? (
        <div className="flex items-center gap-2 print:hidden mr-2">
            <div className="flex">
                <Tooltip
                    title={
                        <div className="p-2">
                            <div className="font-semibold text-white mb-2">
                                People in Lobby
                            </div>
                            <hr className="my-2 p-0" />
                            <div className="space-y-1">
                                {telemetryData &&
                                    telemetryData.lobby_telemetry?.map(
                                        (lobby) => (
                                            <div
                                                key={lobby.id}
                                                className="flex flex-col items-start gap-0.5 mb-2"
                                            >
                                                <span className="font-semibold text-white dark:text-white leading-tight">
                                                    {lobby.lead?.name ||
                                                        'No name'}{' '}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    {lobby.lead?.email ||
                                                        'Unknown'}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                {(!telemetryData?.lobby_telemetry ||
                                    telemetryData?.lobby_telemetry.length ===
                                        0) && (
                                    <div className="text-gray-400 text-sm italic">
                                        No one in lobby yet
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                >
                    <Badge
                        className="mr-4"
                        content={telemetryData?.lobby_telemetry?.length || 0}
                    >
                        <Avatar icon={<HiOutlineUser />} />
                    </Badge>
                </Tooltip>
            </div>
        </div>
    ) : !isHost ? (
        <div className="flex items-center gap-2 print:hidden mr-2">
            {eventStatus === 'ended' ||
                (eventStatus === 'live' && (
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
    ) : (
        <></>
    )
}

export default EventActions
