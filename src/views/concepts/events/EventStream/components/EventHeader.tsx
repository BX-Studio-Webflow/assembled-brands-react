import React, { useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { apiRecordLeaveEvent } from '@/services/TelemetryService'

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
    isHost?: boolean
}

const EventHeader = ({
    status,
    eventName,
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
