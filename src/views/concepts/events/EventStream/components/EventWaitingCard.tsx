import React, { useEffect, useRef } from 'react'
import { useEvent } from '../context/EventContext'
import { Countdown } from '@/utils/countdown'
import { EventStreamResponse } from '@/@types/events'

interface EventWaitingCardProps {
    onCountdownEnd?: () => void
    event: EventStreamResponse
}

const EventWaitingCard: React.FC<EventWaitingCardProps> = ({
    onCountdownEnd,
    event,
}) => {
    const { eventStatus, nextDate } = useEvent()
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

    return (
        <div
            className="flex flex-col items-center justify-center h-full rounded-lg p-8 mb-4 relative"
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
            <div className=" w-1/3 relative z-10 flex flex-col items-center backdrop-blur-sm bg-white/20 rounded-lg p-8">
                <span style={{ fontSize: 48, marginBottom: 16 }}>
                    {eventStatus === 'ended' ? '📹' : '🍿'}
                </span>
                <div className="text-center">
                    {eventStatus === 'early' && (
                        <>
                            <div className="font-bold text-white green-700 text-lg mb-2">
                                This event starts in
                            </div>
                            <div
                                ref={countdownRef}
                                className="font-bold text-white green-700 text-2xl"
                                aria-live="polite"
                            />
                        </>
                    )}
                    {eventStatus === 'ended' && (
                        <div className="font-bold text-white green-700 text-lg">
                            This event has ended
                        </div>
                    )}
                    {eventStatus === 'cancelled' && (
                        <div className="font-bold text-white red-700 text-lg">
                            This event was cancelled
                        </div>
                    )}
                    {eventStatus === 'suspended' && (
                        <div className="font-bold text-yellow-700 text-lg">
                            This event is suspended
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EventWaitingCard
