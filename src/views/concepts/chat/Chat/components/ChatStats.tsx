import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import { apiGetTelemetryByEventId } from '@/services/TelemetryService'
import { EventTelemetry } from '@/@types/telemetry'

type TopChannelProps = {
    eventId: number
    isHost: boolean
}

const { TBody, THead, Tr, Th, Td } = Table

const ChatStats = ({ eventId, isHost }: TopChannelProps) => {
    const [telemetryData, setTelemetryData] = useState<EventTelemetry[]>([])

    // Calculate average watch time
    const totalWatchTime = telemetryData.reduce(
        (sum, item) => sum + (item.total_watch_time || 0),
        0,
    )
    const averageWatchTime =
        telemetryData.length > 0
            ? Math.round(totalWatchTime / telemetryData.length)
            : 0

    //Fire this every 10 seconds
    useEffect(() => {
        // Only track telemetry for non-hosts
        if (!isHost) return

        const interval = setInterval(async () => {
            try {
                const response = await apiGetTelemetryByEventId(Number(eventId))
                setTelemetryData(response)
            } catch (error) {
                console.error('Failed to get telemetry:', error)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [eventId, isHost])

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`
        } else {
            return `${secs}s`
        }
    }

    const csvData = telemetryData.map((item) => ({
        'Lead ID': item.lead_id,
        'Lead Name': item.lead?.name || 'Unknown',
        'Lead Email': item.lead?.email || 'Unknown',
        Phone: item.lead?.phone || 'No phone',
        'Form Identifier': item.lead?.form_identifier || 'None',
        'Membership Active': item.lead?.membership_active ? 'Yes' : 'No',
        'Joined At': new Date(item.joined_at).toLocaleString(),
        'Watch Time': formatDuration(item.total_watch_time || 0),
        Device: item.device || 'Unknown',
        Browser: item.browser || 'Unknown',
        OS: item.os || 'Unknown',
    }))

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Chat stats</h4>
                <CSVLink filename="top-channel.csv" data={csvData}>
                    <Button size="sm">Export data</Button>
                </CSVLink>
            </div>
            <div className="mt-5">
                <div className="mb-2">Average Watch Time</div>
                <div className="flex items-end gap-2 mb-1">
                    <h3>{formatDuration(averageWatchTime)}</h3>
                    <GrowShrinkValue
                        className="font-bold"
                        value={2.6}
                        suffix="%"
                        positiveIcon="+"
                        negativeIcon=""
                    />
                </div>
                <Table className="mt-6" hoverable={false}>
                    <THead>
                        <Tr>
                            <Th className="px-0!">Lead</Th>
                            <Th>Phone</Th>
                            <Th>Form ID</Th>
                            <Th>Membership</Th>
                            <Th>Joined At</Th>
                            <Th>Watch Time</Th>
                            <Th className="px-0!">Device</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {telemetryData.map((session) => (
                            <Tr key={session.id}>
                                <Td className="px-0!">
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            size={28}
                                            src=""
                                            className="bg-transparent"
                                        />
                                        <div>
                                            <div className="heading-text font-bold">
                                                {session.lead?.name ||
                                                    `Lead ${session.lead_id}`}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {session.lead?.email ||
                                                    'No email'}
                                            </div>
                                        </div>
                                    </div>
                                </Td>
                                <Td>
                                    {`${session.lead?.dial_code} ${session.lead?.phone}`}
                                </Td>
                                <Td>
                                    {session.lead?.form_identifier || 'None'}
                                </Td>
                                <Td>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            session.lead?.membership_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {session.lead?.membership_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </Td>
                                <Td>
                                    {new Date(
                                        session.joined_at,
                                    ).toLocaleString()}
                                </Td>
                                <Td>
                                    {formatDuration(
                                        session.total_watch_time || 0,
                                    )}
                                </Td>
                                <Td className="px-0!">
                                    {session.device || 'Unknown'}
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
        </Card>
    )
}

export default ChatStats
