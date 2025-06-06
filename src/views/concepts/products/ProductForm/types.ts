import type { Control, FieldErrors } from 'react-hook-form'

export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    imgList: {
        id: string
        name: string
        img: string
    }[]
    category: string
    price: number
    stock: number
    status: number
    costPerItem: number
    bulkDiscountPrice: number
    taxRate: number | string
    tag: string[]
    brand: string
    vendor: string
    active: boolean
    sales: number
    salesPercentage: number
    description: string
}

export type GeneralFields = {
    name: string
    productCode: string
    description: string
}

export type PricingFields = {
    price: number | string
    taxRate: number | string
    costPerItem: number | string
    bulkDiscountPrice: number | string
}

export type ImageFields = {
    imgList: {
        id: string
        name: string
        img: string
    }[]
}

export type AttributeFields = {
    category: string
    tags?: { label: string; value: string }[]
    brand?: string
    asset?: number
    type?: string
    podcast_url?: string
    episode_type?: string
    podcast_type?: string
}

export type MembershipPlan = {
    id: number
    name: string
    price: number | string
    price_point: string
    billing: string
}

export type PodcastFormSchema = {
    episode_type: string
    name: string
    description: string
    podcast_type: string
    asset?: number | number[]
    podcast_url?: string
    landing_page_url?: string
    cover_image_asset_id?: number
    brand?: string
    membership_plans: MembershipPlan[]
}

export type FormSectionBaseProps = {
    control: Control<PodcastFormSchema>
    errors: FieldErrors<PodcastFormSchema>
}
