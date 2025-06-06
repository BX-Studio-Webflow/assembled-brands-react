import React from 'react'

const mockEvent = {
    status: 'ended', // could be 'active', 'upcoming', etc.
    name: 'XXXXX',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

const statusColors: { [key: string]: string } = {
    ended: 'bg-black text-white',
    active: 'bg-green-500 text-white',
    upcoming: 'bg-blue-500 text-white',
}

const EventHeader = () => {
    const statusClass =
        statusColors[mockEvent.status] || 'bg-gray-400 text-white'

    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{mockEvent.name}</span>
                <span
                    className={`px-2 py-0.5 rounded-md font-sm text-sm ${statusClass}`}
                >
                    {mockEvent.status.charAt(0).toUpperCase() +
                        mockEvent.status.slice(1)}
                </span>
            </div>
            <span className="text-sm mt-8">{mockEvent.description}</span>
        </div>
    )
}

export default EventHeader
