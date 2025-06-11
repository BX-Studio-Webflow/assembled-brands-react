export interface CreateSubscriptionRequestBody {
    priceId: string
    productId: string
    successUrl: string
    cancelUrl: string
}
export interface CreateSubscriptionResponse {
    data: {
        url: string
    }
}
