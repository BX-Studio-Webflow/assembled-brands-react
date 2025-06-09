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
    host_id: number
    status: string
    updated_at: string
    checked?: boolean
    starred?: boolean
    flagged?: boolean
    avatar?: string
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

export type GetMailsRequest = Category

export type GetMailsResponse = Mail[]

export type GetMailRequest = { id: string }

export type GetMailResponse = Mail
