import React, { useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import {
    apiRecordLeaveEvent,
    apiCreateLobbyTelemetry,
    apiUpdateLobbyTelemetry,
    apiLeaveLobby,
} from '@/services/TelemetryService'

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
                    console.log(`Leave event tracked: ${scenario}`)
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
        let lobbyStartTime: number | null = null

        const createLobbySession = async () => {
            try {
                const response = await apiCreateLobbyTelemetry({
                    event_id: Number(eventId),
                    token: token,
                    email: email,
                    code: code,
                })
                sessionId = response.sessionId
                lobbyStartTime = Date.now()
                console.log('Lobby session created:', sessionId)
            } catch (error) {
                console.error('Failed to create lobby telemetry:', error)
            }
        }

        const updateLobbyDuration = async () => {
            if (!sessionId || !lobbyStartTime) return

            try {
                const duration = Math.floor(
                    (Date.now() - lobbyStartTime) / 1000,
                )
                await apiUpdateLobbyTelemetry(sessionId, { duration })
            } catch (error) {
                console.error('Failed to update lobby telemetry:', error)
            }
        }

        const recordLobbyExit = async (
            reason: 'event_started' | 'left' | 'timeout',
        ) => {
            if (!sessionId) return

            try {
                await apiLeaveLobby({
                    session_id: sessionId,
                    exit_reason: reason,
                })
                console.log('Lobby exit recorded:', reason)
            } catch (error) {
                console.error('Failed to record lobby exit:', error)
            }
        }

        // Create lobby session on mount
        createLobbySession()

        // Update duration every 15 seconds
        const interval = setInterval(updateLobbyDuration, 15000)

        // Record exit when component unmounts or status changes
        return () => {
            clearInterval(interval)
            if (sessionId) {
                const reason = status !== 'early' ? 'event_started' : 'left'
                recordLobbyExit(reason)
            }
        }
    }, [eventId, token, email, code, isHost, status])

    return (
        <div className="pt-2">
            <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{eventName}</span>
                <span className={statusPills[status] || statusPills['ended']}>
                    event{' '}
                    {status === 'ended'
                        ? `has ended`
                        : status === 'live'
                          ? ' is live'
                          : status === 'early'
                            ? `starts at ${nextDate?.start.toLocaleString()}`
                            : status === 'suspended'
                              ? 'suspended'
                              : status === 'cancelled'
                                ? 'cancelled'
                                : ''}
                </span>
            </div>
            <span className="text-sm mt-8">{eventDescription}</span>
        </div>
    )
}

export default EventHeader
