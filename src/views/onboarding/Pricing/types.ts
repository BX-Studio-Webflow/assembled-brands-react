export type PaymentCycle = 'monthly' | 'annually'

export interface SelectedPlan {
    planName: string
    price: Record<PaymentCycle, number>
    paymentCycle: PaymentCycle
    planId: string
}

export type GetPricingPanResponse = {
    featuresModel: {
        id: string
        description: string
    }[]
    plans: {
        id: string
        name: string
        description: string
        price: {
            monthly: number
            annually: number
        }
        features: string[]
        recommended: boolean
    }[]
}
