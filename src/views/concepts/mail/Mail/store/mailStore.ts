import { create } from 'zustand'
import { Mail } from '../types'

interface MailState {
    mail: Mail | null
    mailList: Mail[]
    mailListFetched: boolean
    selectedMailId: number[]
    selectedCategory: {
        value: string
        label: string
    }
    mobileSideBarExpand: boolean
    messageDialog: {
        mode: string
        open: boolean
    }
    setMail: (mail: Mail | null) => void
    setMailList: (mailList: Mail[]) => void
    setMailListFetched: (fetched: boolean) => void
    setSelectedMail: (selectedMailId: number[]) => void
    setSelectedCategory: (category: { value: string; label: string }) => void
    toggleMobileSidebar: (expand: boolean) => void
    toggleMessageDialog: (messageDialog: {
        mode: string
        open: boolean
    }) => void
}

export const useMailStore = create<MailState>((set) => ({
    mail: null,
    mailList: [],
    mailListFetched: false,
    selectedMailId: [],
    selectedCategory: {
        value: 'inbox',
        label: 'Inbox',
    },
    mobileSideBarExpand: false,
    messageDialog: {
        mode: '',
        open: false,
    },
    setMail: (mail) => set({ mail }),
    setMailList: (mailList) => set({ mailList }),
    setMailListFetched: (mailListFetched) => set({ mailListFetched }),
    setSelectedMail: (selectedMailId) => set({ selectedMailId }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    toggleMobileSidebar: (mobileSideBarExpand) => set({ mobileSideBarExpand }),
    toggleMessageDialog: (messageDialog) => set({ messageDialog }),
}))
