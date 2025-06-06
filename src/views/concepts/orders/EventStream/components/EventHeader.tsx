import React, { useEffect, useState } from 'react'
import { useEvent } from '../context/EventContext'
import { formatDate } from '@/utils/dates'

const statusPills: { [key: string]: string } = {
    cancelled:
        'bg-red-100 text-red-800 border border-red-400 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400',
    active: 'bg-green-100 text-green-800 border border-green-400 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400',
    suspended:
        'bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300',
    live: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300"',
    early: 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300',
    ended: 'bg-gray-100 text-gray-800 border border-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-400',
}

const EventHeader = () => {
    const { data } = useEvent()
    const [status, setStatus] = useState('early')
    const [statusText, setStatusText] = useState('')

    useEffect(() => {
        if (!data?.event.memberships?.length) return

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

        if (!nextDate) {
            setStatus('ended')
            setStatusText(
                `Event Ended ${formatDate(sortedDates[sortedDates.length - 1].end, 'DD MMM YYYY HH:mm')}`,
            )
            return
        }

        if (data.event.status === 'cancelled') {
            setStatus('cancelled')
            setStatusText('Event cancelled')
        } else if (data.event.status === 'suspended') {
            setStatus('suspended')
            setStatusText('Event suspended')
        } else if (now > nextDate.end) {
            setStatus('ended')
            setStatusText(
                `Event Ended ${formatDate(nextDate.end, 'DD MMM YYYY HH:mm')}`,
            )
        } else if (now > nextDate.start) {
            const timeLeft = Math.round(
                (nextDate.end.getTime() - now.getTime()) / 1000,
            )
            if (timeLeft <= 20 && timeLeft > 0) {
                setStatus('live')
                setStatusText(`Event ending in ${timeLeft} seconds`)
            } else {
                setStatus('live')
                setStatusText('Event is live')
            }
        } else {
            setStatus('early')
            const timeToStart = Math.round(
                (nextDate.start.getTime() - now.getTime()) / 1000,
            )
            const hours = Math.floor(timeToStart / 3600)
            const minutes = Math.floor((timeToStart % 3600) / 60)
            const seconds = timeToStart % 60
            setStatusText(`Event starts in ${hours}h ${minutes}m ${seconds}s`)
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
                <span className={statusPills[status] || statusPills['ended']}>
                    {statusText}
                </span>
            </div>
            <span className="text-sm mt-8">{data.event.event_description}</span>
        </div>
    )
}

export default EventHeader
