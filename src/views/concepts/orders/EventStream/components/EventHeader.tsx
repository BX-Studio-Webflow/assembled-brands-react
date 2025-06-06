import React, { useEffect, useRef } from 'react'
import { useEvent } from '../context/EventContext'
import { formatDate } from '@/utils/dates'
import { Countdown } from '@/utils/countdown'

const statusColors: { [key: string]: string } = {
    cancelled: 'bg-black text-white',
    active: 'bg-green-500 text-white',
    suspended: 'bg-blue-500 text-white',
    live: 'bg-red-500 text-white',
    early: 'bg-yellow-500 text-white',
    ended: 'bg-gray-400 text-white',
}

const EventHeader = () => {
    const { data } = useEvent()
    const countdownRef = useRef<Countdown | null>(null)
    const statusRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (!data?.event.memberships?.length || !statusRef.current) return

        const now = new Date()
        const sortedDates = data.event.memberships
            .flatMap((membership) => membership.dates)
            .map((date) => ({
                start: new Date(Number(date.date) * 1000),
                end: new Date(
                    Number(date.date) * 1000 +
                        (data.event.asset.duration || 0) * 1000,
                ),
            }))
            .sort((a, b) => a.start.getTime() - b.start.getTime())

        const nextDate = sortedDates.find((date) => date.end > now)
        console.log(nextDate)

        if (!nextDate) {
            statusRef.current.textContent = `Event Ended ${formatDate(sortedDates[sortedDates.length - 1].end, 'DD MMM YYYY HH:mm')}`
            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.ended}`
            return
        }

        // Cleanup previous countdown if exists
        if (countdownRef.current) {
            countdownRef.current.destroy()
        }

        if (data.event.status === 'cancelled') {
            statusRef.current.textContent = 'Event cancelled'
            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.cancelled}`
        } else if (data.event.status === 'suspended') {
            statusRef.current.textContent = 'Event suspended'
            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.suspended}`
        } else if (now > nextDate.end) {
            statusRef.current.textContent = `Event Ended ${formatDate(nextDate.end, 'DD MMM YYYY HH:mm')}`
            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.ended}`
        } else if (now > nextDate.start) {
            const timeLeft = Math.round(
                (nextDate.end.getTime() - now.getTime()) / 1000,
            )
            if (timeLeft <= 20 && timeLeft > 0) {
                statusRef.current.textContent = `Event ending in ${timeLeft} seconds`
                statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.live}`
            } else {
                statusRef.current.textContent = 'Event is live'
                statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.live}`
            }
        } else {
            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.early}`
            countdownRef.current = new Countdown(
                statusRef.current,
                nextDate.start,
                {
                    threshold: '0',
                    reset: 'false',
                    onEnd: () => {
                        if (statusRef.current) {
                            statusRef.current.textContent = 'Event is live'
                            statusRef.current.className = `px-2 py-0.5 rounded-md font-sm text-sm ${statusColors.live}`
                        }
                    },
                },
            )
            countdownRef.current.start()
        }

        return () => {
            if (countdownRef.current) {
                countdownRef.current.destroy()
            }
        }
    }, [data])

    if (!data) {
        return <></>
    }

    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                    {data.event.event_name}
                </span>
                <span
                    ref={statusRef}
                    className="px-2 py-0.5 rounded-md font-sm text-sm"
                />
            </div>
            <span className="text-sm mt-8">{data.event.event_description}</span>
        </div>
    )
}

export default EventHeader
