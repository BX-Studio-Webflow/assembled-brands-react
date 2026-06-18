import type { ComponentType } from 'react'
import {
    BusinessIcon,
    DocumentsIcon,
    SupportIcon,
    TeamIcon,
} from '@/components/shared/NavIcons'

export type NavLeaf = {
    label: string
    to: string
}

export type NavGroup = {
    label: string
    icon: ComponentType<{ className?: string }>
    /** Accent color used for the active label of this group (Figma). */
    accent: string
    /** Direct link (for groups without children). */
    to?: string
    children?: NavLeaf[]
}

export const navigation: NavGroup[] = [
    {
        label: 'Business Info',
        icon: BusinessIcon,
        accent: 'var(--color-coral)',
        children: [
            { label: 'Company Profile', to: '/app/company-profile' },
            { label: 'Financial Overview', to: '/app/financial-overview' },
        ],
    },
    {
        label: 'Document Upload Center',
        icon: DocumentsIcon,
        accent: 'var(--color-brandblue)',
        children: [
            { label: 'Financial Reports', to: '/app/documents/financial-reports' },
            { label: 'Accounts & Inventory', to: '/app/documents/accounts-inventory' },
            { label: 'E-Commerce Performance', to: '/app/documents/ecommerce' },
            { label: 'Team & Ownership', to: '/app/documents/team-ownership' },
        ],
    },
    {
        label: 'Support',
        icon: SupportIcon,
        accent: 'var(--color-lightyellow)',
        to: '/app/support',
    },
    {
        label: 'Invite Team Members',
        icon: TeamIcon,
        accent: 'var(--color-softgreen)',
        to: '/app/invite',
    },
]
