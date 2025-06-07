import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    img: string
}

export type AddressFields = {
    country: string
    address: string
    postcode: string
    city: string
}

export type ProfileImageFields = {
    img: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export interface MembershipFormSchema {
    name: string
    description: string
    price: number
    payment_type: 'one_off' | 'recurring'
    price_point: 'standalone' | 'course' | 'podcast'
    billing?: 'per-day' | 'package'
    dates?: string[]
}

export type FormSectionBaseProps = {
    control: Control<MembershipFormSchema>
    errors: FieldErrors<MembershipFormSchema>
}
