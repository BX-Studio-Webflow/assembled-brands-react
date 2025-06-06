export interface MembershipDate {
    id: number
    membership_id: number
    date: string
    created_at: string
    updated_at: string
    user_id: number
}

export interface Membership {
    id: number
    name: string
    description: string
    price: number
    payment_type: 'one_off' | 'recurring'
    price_point: string
    billing: string | null
    created_at: string
    updated_at: string
    user_id: number
    dates: MembershipDate[]
}

export interface MembershipQueryParams {
    pageIndex: number
    pageSize: number
    query: string
    sort: {
        order: string
        key: string
    }
}

export interface GetMembershipsResponse {
    plans: Membership[]
    total: number
}
