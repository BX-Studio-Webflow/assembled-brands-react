import React, { useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import {
    apiRecordLeaveEvent,
    apiCreateLobbyTelemetry,
    apiLeaveLobby,
} from '@/services/TelemetryService'
import { LivestreamStatus } from '@/@types/events'
import Tag from '@/components/ui/Tag'
import { HiX, HiPlay, HiClock, HiPause, HiStop } from 'react-icons/hi'

const getStatusTagProps = (
    status: LivestreamStatus,
    nextDate: { start: Date; end: Date } | null,
) => {
    switch (status) {
        case 'cancelled':
            return {
                className:
                    'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0',
                children: 'event cancelled',
                suffix: <HiX className="ml-1 rtl:mr-1" />,
            }
        case 'suspended':
            return {
                className:
                    'text-yellow-600 bg-yellow-100 dark:text-yellow-100 dark:bg-yellow-500/20 border-0',
                children: 'event suspended',
                suffix: <HiPause className="ml-1 rtl:mr-1" />,
            }
        case 'live':
            return {
                className: 'text-white bg-red-500 border-0',
                children: 'event is live',
                prefix: <HiPlay className="mr-1 rtl:ml-1" />,
            }
        case 'early':
            return {
                className:
                    'text-yellow-600 bg-yellow-100 dark:text-yellow-100 dark:bg-yellow-500/20 border-0',
                children: `event starts at ${nextDate?.start.toLocaleString()}`,
                prefix: <HiClock className="mr-1 rtl:ml-1" />,
            }
        case 'ended':
        default:
            return {
                className:
                    'text-gray-600 bg-gray-100 dark:text-gray-100 dark:bg-gray-500/20 border-0',
                children: 'event has ended',
                suffix: <HiStop className="ml-1 rtl:mr-1" />,
            }
    }
}

interface EventHeaderProps {
    status: LivestreamStatus
    eventName: string
    eventId: string
    eventDescription: string
    nextDate: {
        start: Date
        end: Date
    } | null
    isHost?: boolean
}

const EventHeader = ({
    status,
    eventName,
    eventId,
    eventDescription,
    nextDate,
    isHost = false,
}: EventHeaderProps) => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')

    /**
     * Sync leaving the event
     * Closing the browser tab/window
     * Switching to another tab
     * Navigating to a different page
     * Video ending naturally
     * Component unmounting
     * Page regaining focus
     */
    const trackLeaveEvent = useCallback(
        async (
            scenario:
                | 'TAB_CLOSED'
                | 'TAB_SWITCHED'
                | 'PAGE_NAVIGATED'
                | 'VIDEO_ENDED'
                | 'BROWSER_CLOSED'
                | 'COMPONENT_UNMOUNTED'
                | 'PAGE_FOCUSED',
        ) => {
            if (token && email && code) {
                try {
                    await apiRecordLeaveEvent({
                        token: token,
                        email: email,
                        code: code,
                        scenario: scenario,
                    })
                } catch (error) {
                    console.error(
                        `Failed to track leave event (${scenario}):`,
                        error,
                    )
                }
            }
        },
        [token, email, code],
    )

    // Track when user leaves the event stream
    useEffect(() => {
        // Only track for non-hosts
        if (isHost) return
        if (
            status === 'ended' ||
            status === 'cancelled' ||
            status === 'suspended' ||
            status === 'early'
        ) {
            return
        }

        const handleBeforeUnload = () => {
            if (token && email && code) {
                const data = {
                    token: token,
                    email: email,
                    code: code,
                    scenario: 'BROWSER_CLOSED',
                }

                // Use sendBeacon for more reliable tracking during page unload
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(
                        '/api/telemetry/leave',
                        JSON.stringify(data),
                    )
                } else {
                    // Fallback to synchronous XMLHttpRequest
                    const xhr = new XMLHttpRequest()
                    xhr.open('POST', '/api/telemetry/leave', false) // synchronous
                    xhr.setRequestHeader('Content-Type', 'application/json')
                    xhr.send(JSON.stringify(data))
                }
            }
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                trackLeaveEvent('TAB_SWITCHED')
            } else if (document.visibilityState === 'visible') {
                trackLeaveEvent('PAGE_FOCUSED')
            }
        }

        const handlePageHide = () => {
            trackLeaveEvent('PAGE_NAVIGATED')
        }

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('pagehide', handlePageHide)

        // Cleanup function
        return () => {
            // Track component unmount
            trackLeaveEvent('COMPONENT_UNMOUNTED')

            // Remove event listeners
            window.removeEventListener('beforeunload', handleBeforeUnload)
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
            window.removeEventListener('pagehide', handlePageHide)
        }
    }, [trackLeaveEvent, isHost, status, token, email, code])

    //Track lobby telemetry when the lead and event has not started, status early
    useEffect(() => {
        // Only track telemetry for non-hosts
        if (isHost) return
        if (status !== 'early') return
        if (!token || !email || !code) return

        let sessionId: string | null = null
        let leadId: number | null = null

        const createLobbySession = async () => {
            try {
                const response = await apiCreateLobbyTelemetry({
                    event_id: Number(eventId),
                    token: token,
                    email: email,
                    code: code,
                })
                sessionId = response.sessionId
                // Extract lead_id from sessionId (format: "lead_id_event_id")
                const parts = sessionId.split('_')
                if (parts.length >= 2) {
                    leadId = parseInt(parts[0])
                }
            } catch (error) {
                console.error('Failed to create lobby telemetry:', error)
            }
        }

        const recordLobbyExit = async (
            reason: 'event_started' | 'left' | 'timeout',
        ) => {
            if (!leadId) return

            try {
                await apiLeaveLobby({
                    lead_id: leadId,
                    event_id: Number(eventId),
                    exit_reason: reason,
                })
            } catch (error) {
                console.error('Failed to record lobby exit:', error)
            }
        }

        // Create lobby session on mount
        createLobbySession()

        // Record exit when component unmounts or status changes
        return () => {
            if (leadId) {
                const reason = status !== 'early' ? 'event_started' : 'left'
                recordLobbyExit(reason)
            }
        }
    }, [eventId, token, email, code, isHost, status])

    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{eventName}</span>
                <Tag {...getStatusTagProps(status, nextDate)} />
            </div>
            <span className="text-sm mt-8">{eventDescription}</span>
        </div>
    )
}

export default EventHeader
