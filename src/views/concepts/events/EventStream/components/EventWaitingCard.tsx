import React, { useEffect, useRef } from 'react'
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

    const handleMoreInfoClick = () => {
        window.open(event.event.landing_page_url, '_blank')
    }

    const eventTimelines = localStorage.getItem('event_timelines')
    const eventTimelinesData = eventTimelines ? JSON.parse(eventTimelines) as EventTimelinesType : null
    const is60MinutesAfterEnd = eventTimelinesData && dayjs(eventTimelinesData.end).isAfter(dayjs().add(60, 'minutes'))

    console.log({ is60MinutesAfterEnd, eventStatus, eventTimelinesData })

    return (

        <div className='w-full h-full flex gap-2 mb-2'>
            {eventStatus === 'ended' && is60MinutesAfterEnd && (
                <div className='h-full'>
                    <EventSidebar event={event} isHost={isHost || false} nextDate={nextDate || null} eventStatus={eventStatus} />
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
                                    <Button className="mr-2" icon={<HiOutlineGlobe />} onClick={handleMoreInfoClick}>
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
