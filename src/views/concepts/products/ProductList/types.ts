export interface PodcastRow {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    stock: number
    sales: number
    salesPercentage: number
    status: 'published' | 'draft'
    description: string
    type: 'link' | 'prerecorded'
    episodeType: 'single' | 'multiple'
    host: string
    membershipNames: string
    createdAt: string
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    productStatus: string
    productType: string[]
}
