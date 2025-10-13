import React, { useEffect, useRef, useState } from 'react'
import { useEvent } from '../context/EventContext'
import { Countdown } from '@/utils/countdown'
import { EventStreamResponse, EventTimelinesType } from '@/@types/events'
import { HiOutlineGlobe } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import EventSidebar from './EventSidebar'
import dayjs from 'dayjs'

interface EventWaitingCardProps {
    onCountdownEnd?: () => void
    event: EventStreamResponse
}

const EventWaitingCard: React.FC<EventWaitingCardProps> = ({
    onCountdownEnd,
    event,
}) => {
    const { eventStatus, nextDate, isHost } = useEvent()
    const countdownRef = useRef<HTMLDivElement>(null)
    const [isWithinGracePeriod, setIsWithinGracePeriod] = useState(false)

    const GRACE_PERIOD_MINUTES = 60

    const checkGracePeriod = (
        timelines: EventTimelinesType | null,
    ): boolean => {
        if (!timelines) return false
        return (
            dayjs().isAfter(dayjs(timelines.end)) &&
            dayjs().isBefore(
                dayjs(timelines.end).add(GRACE_PERIOD_MINUTES, 'minutes'),
            )
        )
    }

    // Countdown effect for 'early' status
    useEffect(() => {
        let countdown: Countdown | null = null
        if (eventStatus === 'early' && nextDate && countdownRef.current) {
            countdown = new Countdown(countdownRef.current, nextDate.start, {
                threshold: '0',
                reset: 'false',
                onEnd: () => {
                    onCountdownEnd?.()
                },
            })
            countdown.start()
        } else if (countdownRef.current) {
            countdownRef.current.textContent = ''
        }
        return () => {
            countdown?.destroy()
        }
    }, [eventStatus, nextDate, onCountdownEnd])

    useEffect(() => {
        const eventTimelines = localStorage.getItem('event_timelines')
        const eventTimelinesData = eventTimelines
            ? (JSON.parse(eventTimelines) as EventTimelinesType)
            : null

        setIsWithinGracePeriod(checkGracePeriod(eventTimelinesData))

        if (eventStatus !== 'ended' || !eventTimelinesData) return

        // Check every 10 seconds
        const interval = setInterval(() => {
            const stillInGracePeriod = checkGracePeriod(eventTimelinesData)
            setIsWithinGracePeriod(stillInGracePeriod)

            const differenceInMinutes = dayjs().diff(
                dayjs(eventTimelinesData.end),
                'minutes',
            )
            console.log({
                isWithinGracePeriod: stillInGracePeriod,
                eventStatus,
                eventTimelinesData,
                differenceInMinutes,
            })

            if (!stillInGracePeriod) {
                clearInterval(interval)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [eventStatus])

    const handleMoreInfoClick = () => {
        window.open(event.event.landing_page_url, '_blank')
    }

    return (
        <div className="w-full h-full flex gap-2 mb-2">
            {eventStatus === 'ended' && isWithinGracePeriod && (
                <div className="h-full">
                    <EventSidebar
                        event={event}
                        isHost={isHost || false}
                        nextDate={nextDate || null}
                        eventStatus={eventStatus}
                    />
                </div>
            )}
            <div
                className="flex flex-col items-center justify-center h-full rounded-lg p-4 sm:p-6 md:p-8 mb-4 relative w-full"
                style={{
                    backgroundImage: event.event.asset.image_presigned_url
                        ? `url(${event.event.asset.image_presigned_url})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Content with relative positioning to appear above overlay */}
                <div className="w-1/2 relative z-10 flex flex-col items-center backdrop-blur-sm bg-white/20 rounded-lg p-4 sm:p-6 md:p-8">
                    <div className="text-center">
                        {eventStatus === 'early' && (
                            <>
                                <div className="font-bold text-white green-700 text-base sm:text-lg md:text-xl mb-2">
                                    This event starts in
                                </div>
                                <div
                                    ref={countdownRef}
                                    className="font-bold text-white green-700 text-xl sm:text-2xl md:text-3xl"
                                    aria-live="polite"
                                />
                            </>
                        )}
                        {eventStatus === 'ended' && (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="font-bold text-white green-700 text-base sm:text-lg md:text-xl">
                                    This event has ended
                                </div>
                                <div>
                                    <Button
                                        className="mr-2"
                                        icon={<HiOutlineGlobe />}
                                        onClick={handleMoreInfoClick}
                                    >
                                        <span>
                                            <span>More Infomation</span>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {eventStatus === 'cancelled' && (
                            <div className="font-bold text-white red-700 text-base sm:text-lg md:text-xl">
                                This event was cancelled
                            </div>
                        )}
                        {eventStatus === 'suspended' && (
                            <div className="font-bold text-yellow-700 text-base sm:text-lg md:text-xl">
                                This event is suspended
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventWaitingCard
