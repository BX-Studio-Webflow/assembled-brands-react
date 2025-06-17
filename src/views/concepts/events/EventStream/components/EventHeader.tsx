
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

interface EventHeaderProps {
    status: 'cancelled' | 'suspended' | 'ended' | 'live' | 'early'
    eventName: string
    eventDescription: string
    nextDate: {
        start: Date
        end: Date
    } | null
}

const EventHeader = ({ status, eventName, eventDescription, nextDate }: EventHeaderProps) => {
    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                    {eventName}
                </span>
                <span className={statusPills[status] || statusPills['ended']}>
                    event {status === 'ended' ? `ended at ${nextDate?.end.toLocaleString()}` : status === 'live' ? ' is live' : status === 'early' ? `starts at ${nextDate?.start.toLocaleString()}` : status === 'suspended' ? 'suspended' : status === 'cancelled' ? 'cancelled' : ''}
                </span>
            </div>
            <span className="text-sm mt-8">{eventDescription}</span>
        </div>
    )
}

export default EventHeader
