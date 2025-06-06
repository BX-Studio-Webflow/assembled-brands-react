import React from 'react'
import { useEvent } from '../context/EventContext'

const statusColors: { [key: string]: string } = {
    cancelled: 'bg-black text-white',
    active: 'bg-green-500 text-white',
    suspended: 'bg-blue-500 text-white',
}

const EventHeader = () => {
    const { data } = useEvent()

    if (!data) {
        console.log('data is null')
        return null
    }

    const statusClass =
        statusColors[data.event.status] || 'bg-gray-400 text-white'

    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                    {data.event.event_name}
                </span>
                <span
                    className={`px-2 py-0.5 rounded-md font-sm text-sm ${statusClass}`}
                >
                    {data.event.status.charAt(0).toUpperCase() +
                        data.event.status.slice(1)}
                </span>
            </div>
            <span className="text-sm mt-8">{data.event.event_description}</span>
        </div>
    )
}

export default EventHeader
