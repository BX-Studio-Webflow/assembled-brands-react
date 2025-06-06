import { create } from 'zustand'
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
} from 'firebase/firestore'
import FirebaseDB from '@/services/firebase/FirebaseDB'
import type {
    Chats,
    ChatType,
    GetConversationResponse,
    Conversations,
    Message,
    SelectedChat,
} from '../types'

type ContactInfoDrawer = {
    userId: string
    chatId: string
    chatType: ChatType | ''
    open: boolean
}

export type ChatState = {
    conversationRecord: Conversations
    selectedChat: SelectedChat
    selectedChatType: ChatType | ''
    mobileSideBarExpand: boolean
    chats: Chats
    chatsFetched: boolean
    contactListDialog: boolean
    contactInfoDrawer: ContactInfoDrawer
    messages: Message[]
    unsubscribe: (() => void) | null
    subscribeToMessages: (eventId: string) => void
    sendMessage: (
        senderId: string,
        name: string,
        text: string,
        isHost: boolean,
        eventId: string,
    ) => Promise<string>
    deleteMessage: (messageId: string) => Promise<void>
}

type ChatAction = {
    setChats: (payload: Chats) => void
    setChatsFetched: (payload: boolean) => void
    setSelectedChat: (payload: SelectedChat) => void
    setContactInfoDrawer: (payload: ContactInfoDrawer) => void
    setChatMute: (payload: { id: string; muted: boolean }) => void
    setSelectedChatType: (payload: ChatType | '') => void
    setChatRead: (payload: string) => void
    setContactListDialog: (payload: boolean) => void
    setMobileSidebar: (payload: boolean) => void
    pushConversationRecord: (payload: GetConversationResponse) => void
    pushConversationMessage: (id: string, conversation: Message) => void
    deleteConversationRecord: (payload: string) => void
}

const initialState: ChatState = {
    conversationRecord: [],
    selectedChat: {},
    mobileSideBarExpand: false,
    chats: [],
    selectedChatType: 'personal',
    chatsFetched: false,
    contactListDialog: false,
    contactInfoDrawer: {
        userId: '',
        chatId: '',
        chatType: '',
        open: false,
    },
    messages: [],
    unsubscribe: null,
    subscribeToMessages: () => {},
    sendMessage: async () => '',
    deleteMessage: async () => {},
}

export const useChatStore = create<ChatState & ChatAction>((set, get) => ({
    ...initialState,
    setChats: (payload) => set(() => ({ chats: payload })),
    setChatsFetched: (payload) => set(() => ({ chatsFetched: payload })),
    setSelectedChat: (payload) => set(() => ({ selectedChat: payload })),
    setContactInfoDrawer: (payload) =>
        set(() => ({ contactInfoDrawer: payload })),
    setChatMute: ({ id, muted }) =>
        set(() => {
            const chats = get().chats.map((chat) => {
                if (chat.id === id) {
                    chat.muted = muted
                }
                return chat
            })
            return { chats }
        }),
    setSelectedChatType: (payload) =>
        set(() => ({ selectedChatType: payload })),
    setChatRead: (id) =>
        set(() => {
            const chats = get().chats.map((chat) => {
                if (chat.id === id) {
                    chat.unread = 0
                }
                return chat
            })
            return { chats }
        }),
    setContactListDialog: (payload) =>
        set(() => ({ contactListDialog: payload })),
    setMobileSidebar: (payload) =>
        set(() => ({ mobileSideBarExpand: payload })),
    pushConversationRecord: (payload) =>
        set(() => {
            const previousConversationRecord = get().conversationRecord
            return {
                conversationRecord: [
                    ...previousConversationRecord,
                    ...[payload],
                ],
            }
        }),
    pushConversationMessage: (id, message) =>
        set(() => {
            const previousConversationRecord = get().conversationRecord
            const conversationRecord = structuredClone(
                previousConversationRecord,
            ).map((record) => {
                if (id === record.id) {
                    record.conversation.push(message)
                }
                return record
            })
            return {
                conversationRecord,
            }
        }),
    deleteConversationRecord: (payload) =>
        set(() => {
            const previousConversationRecord = get().conversationRecord
            const previousChats = get().chats
            return {
                conversationRecord: previousConversationRecord.filter(
                    (record) => record.id !== payload,
                ),
                chats: previousChats.filter((chat) => chat.id !== payload),
            }
        }),
    subscribeToMessages: (eventId) => {
        const currentUnsubscribe = get().unsubscribe
        if (currentUnsubscribe) {
            currentUnsubscribe()
        }

        const messagesRef = collection(
            FirebaseDB,
            'events',
            eventId,
            'messages',
        )
        const q = query(messagesRef, orderBy('timestamp', 'asc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages: Message[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                messages.push({
                    id: doc.id,
                    senderId: data.senderId,
                    name: data.name || 'Unknown',
                    text: data.text,
                    timestamp: data.timestamp?.toMillis() || Date.now(),
                    isHost: data.isHost || false,
                    eventId: eventId,
                })
            })
            set({ messages })
        })

        set({ unsubscribe })
    },
    sendMessage: async (senderId, name, text, isHost, eventId) => {
        const messagesRef = collection(
            FirebaseDB,
            'events',
            eventId,
            'messages',
        )
        const docRef = await addDoc(messagesRef, {
            senderId,
            name,
            text,
            timestamp: serverTimestamp(),
            isHost,
        })

        return docRef.id
    },
    deleteMessage: async (messageId) => {
        const eventId = get().messages.find((m) => m.id === messageId)?.eventId
        if (!eventId) {
            throw new Error('Message not found')
        }
        const messageRef = doc(
            FirebaseDB,
            'events',
            eventId,
            'messages',
            messageId,
        )
        await deleteDoc(messageRef)
    },
}))
