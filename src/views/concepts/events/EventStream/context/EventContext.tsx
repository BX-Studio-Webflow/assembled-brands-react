import React, { createContext, useContext } from 'react'
import { EventStreamResponse } from '@/@types/events'

interface EventContextType {
    data: EventStreamResponse | null
    isLoading: boolean
    eventStatus?: string
    nextDate?: { start: Date; end: Date } | null
}

const EventContext = createContext<EventContextType>({
    data: null,
    isLoading: false,
    eventStatus: undefined,
    nextDate: null,
})

export const useEvent = () => useContext(EventContext)

interface EventProviderProps {
    children: React.ReactNode
    value: EventContextType
}

export const EventProvider: React.FC<EventProviderProps> = ({
    children,
    value,
}) => {
    return (
        <EventContext.Provider value={value}>{children}</EventContext.Provider>
    )
}
