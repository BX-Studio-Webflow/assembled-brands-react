import type { ComponentType } from 'react'
import {
    ApplicationsIcon,
    BusinessIcon,
    DocumentsIcon,
    SupportIcon,
    TeamIcon,
} from '@/components/shared/NavIcons'

export const SUPPORT_URL = 'https://bx-assembled.webflow.io/support'

export function isExternalNavUrl(url: string) {
    return /^https?:\/\//i.test(url)
}

export type NavLeaf = {
    label: string
    to: string
}

export type NavGroup = {
    label: string
    icon: ComponentType<{ className?: string }>
    accent: string
    to?: string
    children?: NavLeaf[]
}

/** Cold / standard finance portal navigation (legacy sitemap paths). */
export const financeNavigation: NavGroup[] = [
    {
        label: 'Business Info',
        icon: BusinessIcon,
        accent: 'var(--color-coral)',
        children: [
            { label: 'Company Profile', to: '/finance-company-profile' },
            { label: 'Financial Overview', to: '/finance-financial-overview' },
        ],
    },
    {
        label: 'Document Upload Center',
        icon: DocumentsIcon,
        accent: 'var(--color-brandblue)',
        children: [
            {
                label: 'Financial Reports',
                to: '/finance-docs-financial-reports',
            },
            {
                label: 'Accounts & Inventory',
                to: '/finance-docs-accounts-and-inventory',
            },
            {
                label: 'E-Commerce Performance',
                to: '/finance-docs-ecommerce-performance',
            },
            {
                label: 'Team & Ownership',
                to: '/finance-docs-team-and-ownership',
            },
        ],
    },
    {
        label: 'Support',
        icon: SupportIcon,
        accent: 'var(--color-lightyellow)',
        to: SUPPORT_URL,
    },
    {
        label: 'Invite Team Members',
        icon: TeamIcon,
        accent: 'var(--color-softgreen)',
        to: '/invite-team-members',
    },
]

/** Warm-lead navigation (legacy sitemap paths under /warm/). */
export const warmNavigation: NavGroup[] = [
    {
        label: 'Business Info',
        icon: BusinessIcon,
        accent: 'var(--color-coral)',
        children: [
            {
                label: 'Company Profile',
                to: '/warm/onboarding-warm-lead',
            },
        ],
    },
    {
        label: 'Document Upload Center',
        icon: DocumentsIcon,
        accent: 'var(--color-brandblue)',
        children: [
            {
                label: 'Financial Reports',
                to: '/warm/finance-docs-financial-report',
            },
            {
                label: 'Financial Forecasts',
                to: '/warm/finance-docs-forecasts',
            },
            {
                label: 'Accounts & Inventory',
                to: '/warm/finance-docs-accounts-and-inventory',
            },
            {
                label: 'E-Commerce Performance',
                to: '/warm/finance-docs-ecommerce-performance',
            },
            {
                label: 'Team & Ownership',
                to: '/warm/finance-docs-team-and-ownership',
            },
            {
                label: 'Optional Documents',
                to: '/warm/finance-docs-optional-docs',
            },
        ],
    },
    {
        label: 'Support',
        icon: SupportIcon,
        accent: 'var(--color-lightyellow)',
        to: SUPPORT_URL,
    },
    {
        label: 'Invite Team Members',
        icon: TeamIcon,
        accent: 'var(--color-softgreen)',
        to: '/warm/invite-team-members',
    },
    {
        label: 'My Applications',
        icon: ApplicationsIcon,
        accent: 'var(--color-coral)',
        to: '/warm/finance-my-applications',
    },
]

/** @deprecated Use financeNavigation or warmNavigation */
export const navigation = financeNavigation
