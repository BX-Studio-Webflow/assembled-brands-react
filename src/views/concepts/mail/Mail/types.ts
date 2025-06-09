import type { JSX } from 'react'

export type Category = {
    category: string
    value?: string
    label?: string
}

export type Message = {
    id: number
    name: string
    mail: string[]
    from: string
    avatar: string
    date: string
    content: string
    attachment: {
        file: string
        size: string
        type: string
    }[]
}

export interface Mail {
    id: number
    email: string
    subject: string
    title: string
    subtitle: string
    body: string
    button_text: string
    button_link: string
    created_at: string
    checked: boolean
    starred: boolean
    flagged: boolean
    host_id: number
    status: 'draft' | 'sent'
    updated_at: string
}

export type MenuBase = {
    value: string
    label: string
}

export type Group = MenuBase & {
    icon: JSX.Element
}

export type Label = MenuBase & {
    bgClass: string
    dotClass: string
}

export interface GetMailsRequest {
    category?: string
    label?: string
}

export interface GetMailsResponse extends Array<Mail> {}

export interface GetMailRequest {
    id: string
}

export interface GetMailResponse extends Mail {}
