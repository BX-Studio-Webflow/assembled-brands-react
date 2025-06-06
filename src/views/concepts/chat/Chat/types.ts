export type TabType = 'chat' | 'event'

export type Chat = {
    id: string
    name: string
    userId: string
    avatar: string
    unread: number
    time: number
    lastConversation: string
    muted: boolean
    chatType: TabType
    groupId: string
}

export interface Message {
    id: string
    senderId: string
    name: string
    text: string
    timestamp: number
    isHost: boolean
    eventId?: string
    type?: 'regular' | 'reply' | 'deleted' | 'divider'
    attachments?: {
        type: string
        source: File
        mediaUrl: string
    }[]
}

export type SelectedChat = {
    id?: string
    user?: {
        id: string
        name: string
        avatarImageUrl: string
    }
    muted?: boolean
    chatType?: TabType
    members?: {
        id: string
        name: string
        avatarImageUrl: string
    }
}

export type Messages = Message[]

export interface GetConversationResponse {
    id: string
    conversation: Message[]
}

export type Conversations = GetConversationResponse[]

export type Chats = Chat[]

export type UserDetails = {
    id: string
    name: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    title: string
    personalInfo: {
        birthday: string
        phoneNumber: string
    }
    members: {
        id: string
        name: string
        img: string
        email: string
    }[]
}

export interface GetChatsResponse {
    id: string
    name: string
    avatar: string
    lastConversation: string
    time: number
    unread: number
    muted: boolean
    chatType: TabType
    userId?: string
    groupId?: string
}

export interface GetContactsResponse {
    id: string
    name: string
    avatarImageUrl: string
    lastSeen: string
    status: string
    unread: number
}

export type GetContactDetailResponse = {
    userDetails: UserDetails
    media: {
        images: {
            id: string
            url: string
            name: string
        }[]
        files: {
            id: string
            name: string
            fileType: string
            srcUrl: string
            size: number
        }[]
        links: {
            id: string
            favicon: string
            title: string
            description: string
            url: string
        }[]
    }
}
