export interface CreateSubscriptionRequestBody {
    priceId: string
    productId: string
    successUrl: string
    cancelUrl: string
    product: 'basic' | 'popular' | 'advanced' | 'enterprise' | 'subscription'
    [key: string]: string
}
export interface CreateSubscriptionResponse {
    data: {
        url: string
    }
}
