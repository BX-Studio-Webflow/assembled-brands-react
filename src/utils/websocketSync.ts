import dayjs from 'dayjs'

interface TimeSyncMessage {
    type: 'time_sync' | 'connected' | 'event_ended'
    eventId?: number
    currentTime?: number
    timestamp: number
    isHost?: boolean
    clientId?: string
    eventStartTime?: number
    eventEndTime?: number
}

interface WebSocketSyncCallbacks {
    onTimeSync?: (currentTime: number) => void
    onConnected?: (clientId: string) => void
    onError?: (error: Event) => void
    onClose?: () => void
    onEventEnded?: (eventId: number) => void
}

class WebSocketSyncManager {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private eventId: number
    private eventStartTime: number
    private eventEndTime: number
    private callbacks: WebSocketSyncCallbacks
    private clientId: string | null = null
    private isConnected = false
    private eventHasEnded = false
    /**
     * @param eventId: number - The ID of the event
     * @param eventStartTime: number - The start time of the event in milliseconds
     * @param eventEndTime: number - The end time of the event in milliseconds
     * @param callbacks: WebSocketSyncCallbacks - The callbacks to be called when the event starts, ends, or when an error occurs
     */
    constructor(
        eventId: number,
        eventStartTime: number,
        eventEndTime: number,
        callbacks: WebSocketSyncCallbacks,
    ) {
        this.eventId = eventId
        this.eventStartTime = eventStartTime
        this.eventEndTime = eventEndTime
        this.callbacks = callbacks
    }

    /**
     * Connect to WebSocket server
     */
    connect(): void {
        // Don't connect if event has ended
        if (this.eventHasEnded) {
            console.log('Event has ended, not connecting to WebSocket')
            return
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return
        }

        // Use environment variable for WebSocket URL, fallback to localhost for development
        const wsUrl = `wss://api.3themind.com/ws`

        this.ws = new WebSocket(wsUrl)
        console.log('Connecting to WebSocket:', wsUrl)
        this.ws.onopen = () => {
            console.log('WebSocket connected')
            this.isConnected = true
            this.reconnectAttempts = 0

            // Send initial message to join event room
            this.sendMessage({
                type: 'time_sync',
                eventId: this.eventId,
                currentTime: 0,
                timestamp: Date.now(),
                isHost: false,
                eventStartTime: this.eventStartTime,
                eventEndTime: this.eventEndTime,
            })
        }

        this.ws.onmessage = (event) => {
            try {
                const message: TimeSyncMessage = JSON.parse(event.data)
                this.handleMessage(message)
            } catch (error) {
                console.error('❌ Failed to parse WebSocket message:', error)
            }
        }

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error)
            this.isConnected = false
            this.callbacks.onError?.(error)
        }

        this.ws.onclose = () => {
            console.log('🔌WebSocket disconnected')
            this.isConnected = false
            this.callbacks.onClose?.()
            this.attemptReconnect()
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    private handleMessage(message: TimeSyncMessage): void {
        switch (message.type) {
            case 'connected':
                this.clientId = message.clientId || null
                this.callbacks.onConnected?.(this.clientId!)
                console.log('WebSocket client ID:', this.clientId)
                break

            case 'time_sync':
                if (message.currentTime !== undefined) {
                    this.callbacks.onTimeSync?.(message.currentTime)
                }
                break

            case 'event_ended':
                this.eventHasEnded = true
                this.callbacks.onEventEnded?.(Number(message.eventId))
                // Disconnect immediately after receiving event_ended
                this.disconnect()
                break

            default:
                console.warn('Unknown WebSocket message type:', message.type)
        }
    }

    /**
     * Send message to WebSocket server
     */
    private sendMessage(message: TimeSyncMessage): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message))
        } else {
            console.warn('WebSocket not connected, cannot send message')
        }
    }

    /**
     * Attempt to reconnect to WebSocket server
     */
    private attemptReconnect(): void {
        // Don't reconnect if event has ended
        if (this.eventHasEnded) {
            console.log('Event has ended, not attempting to reconnect')
            return
        }

        //If current time is after event end time, return
        if (dayjs().isAfter(this.eventEndTime)) {
            console.log('😶 Event has ended, not reconnecting to WebSocket')
            return
        }
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached')
            return
        }

        this.reconnectAttempts++
        console.log(
            `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
        )

        setTimeout(() => {
            this.connect()
        }, this.reconnectDelay * this.reconnectAttempts)
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.isConnected = false
        this.clientId = null
        // Reset reconnect attempts when disconnecting
        this.reconnectAttempts = 0
    }

    /**
     * Check if WebSocket is connected
     */
    isConnectedToServer(): boolean {
        return this.isConnected && this.ws?.readyState === WebSocket.OPEN
    }

    /**
     * Get client ID
     */
    getClientId(): string | null {
        return this.clientId
    }
}

export default WebSocketSyncManager
