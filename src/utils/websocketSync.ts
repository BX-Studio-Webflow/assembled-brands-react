interface TimeSyncMessage {
    type: 'time_sync' | 'connected'
    eventId?: number
    currentTime?: number
    timestamp: number
    isHost?: boolean
    clientId?: string
    membershipId?: number
}

interface WebSocketSyncCallbacks {
    onTimeSync?: (currentTime: number) => void
    onConnected?: (clientId: string) => void
    onError?: (error: Event) => void
    onClose?: () => void
}

class WebSocketSyncManager {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private eventId: number
    private membershipId: number
    private callbacks: WebSocketSyncCallbacks
    private clientId: string | null = null
    private isConnected = false

    constructor(
        eventId: number,
        membershipId: number,
        callbacks: WebSocketSyncCallbacks,
    ) {
        this.eventId = eventId
        this.membershipId = membershipId
        this.callbacks = callbacks
    }

    /**
     * Connect to WebSocket server
     */
    connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return
        }

        // Use environment variable for WebSocket URL, fallback to localhost for development
        const wsUrl = `wss://api.3themind.com/ws`

        console.log('Connecting to WebSocket:', wsUrl)
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
            console.log('WebSocket connected')
            this.isConnected = true
            this.reconnectAttempts = 0

            // Send initial message to join event room
            this.sendMessage({
                type: 'time_sync',
                eventId: this.eventId,
                membershipId: this.membershipId,
                currentTime: 0,
                timestamp: Date.now(),
                isHost: false,
            })
        }

        this.ws.onmessage = (event) => {
            try {
                const message: TimeSyncMessage = JSON.parse(event.data)
                this.handleMessage(message)
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error)
            }
        }

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            this.isConnected = false
            this.callbacks.onError?.(error)
        }

        this.ws.onclose = () => {
            console.log('WebSocket disconnected')
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
