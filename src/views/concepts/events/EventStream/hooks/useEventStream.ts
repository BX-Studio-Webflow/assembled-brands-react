import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { EventStreamResponse, EventTimelinesType, LivestreamStatus } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'
import { apiRecordLeaveEvent } from '@/services/TelemetryService'

interface UseEventStreamParams {
    eventId: number
    token?: string | null
    email?: string | null
    code?: string | null
    isHost: boolean
}

interface UseEventStreamReturn {
    data: EventStreamResponse | undefined
    isLoading: boolean
    eventStatus: LivestreamStatus | undefined
    nextDate: { start: Date; end: Date } | null
    isHost: boolean
    handleStatusUpdate: (status: LivestreamStatus) => Promise<void>
    handleUIStateChange: (status: LivestreamStatus) => void
}

const GRACE_PERIOD_MS = 60 * 60 * 1000 // 60 minutes

const setEventTimelines = (start: Date, end: Date, event_id: number) => {
    const event_timelines: EventTimelinesType = {
        start: start,
        end: end,
        event_id: event_id,
    }
    localStorage.setItem('event_timelines', JSON.stringify(event_timelines))
}

export const useEventStream = ({
    eventId,
    token,
    email,
    code,
    isHost,
}: UseEventStreamParams): UseEventStreamReturn => {
    const [uiState, setUIState] = useState<LivestreamStatus>('early')

    const swrKey = [`/event/stream/${eventId}`]
    const { data, isLoading } = useSWR<EventStreamResponse>(
        swrKey,
        () =>
            apiStreamEvent({
                email: email || undefined,
                token: token || undefined,
                event_id: eventId,
                isHost: isHost,
            }),
        { revalidateOnFocus: false },
    )

    // Compute eventStatus and nextDate
    const { eventStatus, nextDate } = useMemo(() => {
        if (!data?.event.memberships?.length)
            return {
                eventStatus: undefined,
                nextDate: null,
            }

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

        // Find events that have ended within grace period
        const recentlyEnded = sortedDates.find(
            (date) =>
                now > date.end &&
                now <= new Date(date.end.getTime() + GRACE_PERIOD_MS),
        )

        // Find the currently live event
        const currentLive = sortedDates.find(
            (date) =>
                now >= new Date(date.start.getTime() - 5000) &&
                now <= date.end,
        )

        // Find the next upcoming event
        const next = sortedDates.find((date) => date.end > now) || null

        let status: LivestreamStatus = 'early'
        let activeDate = next // Default to next upcoming

        // Check for cancelled or suspended first
        if (data.event.status === 'cancelled') {
            status = 'cancelled'
        } else if (data.event.status === 'suspended') {
            status = 'suspended'
        } else if (currentLive) {
            // Currently live
            status = 'live'
            activeDate = currentLive
            setEventTimelines(currentLive.start, currentLive.end, data.event.id)
        } else if (recentlyEnded) {
            // Within grace period after event ended
            status = 'ended'
            activeDate = recentlyEnded
        } else if (!next) {
            // No upcoming events at all
            status = 'ended'
            activeDate = null
        }
        // else: status remains 'early' for next upcoming event

        // Override with UI state if it's been set
        if (uiState !== 'early') {
            status = uiState
            const eventForTimelines = currentLive || recentlyEnded || next
            if (status === 'live' && eventForTimelines) {
                setEventTimelines(
                    eventForTimelines.start,
                    eventForTimelines.end,
                    data.event.id,
                )
            }
        }

        return { eventStatus: status, nextDate: activeDate }
    }, [data, uiState])

    const handleStatusUpdate = async (status: LivestreamStatus) => {
        if (status === 'ended' && token && email && code) {
            await apiRecordLeaveEvent({
                token: token,
                email: email,
                code: code,
                scenario: 'VIDEO_ENDED',
            })
        }
        setUIState(status)
    }

    const handleUIStateChange = (uiStatus: LivestreamStatus) => {
        setUIState(uiStatus)
    }

    return {
        data,
        isLoading,
        eventStatus,
        nextDate,
        isHost,
        handleStatusUpdate,
        handleUIStateChange,
    }
}

