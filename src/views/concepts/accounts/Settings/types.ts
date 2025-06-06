export type View =
    | 'profile'
    | 'security'
    | 'notification'
    | 'billing'
    | 'integration'

export type CreditCard = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

export type CreditCardInfo = { cardId: string } & CreditCard

export type Integration = {
    id: string
    name: string
    desc: string
    img: string
    type: string
    active: boolean
    installed?: boolean
}

export type GetSettingsProfileResponse = {
    business: {
        auth_provider: 'google' | 'email'
        bio: null
        createdAt: string
        email: string
        id: number
        is_banned: boolean
        is_deleted: false
        is_verified: true
        name: string
        phone: string
        profile_picture: string
        role: 'host' | 'master' | 'owner' | 'guest'
        stripe_account_id: string | null
        subscription_status: 'active' | 'inactive' | 'expired'
    }
}

export type GetSettingsNotificationResponse = {
    email: string[]
    desktop: boolean
    unreadMessageBadge: boolean
    notifymeAbout: string
}

export type GetSettingsBillingResponse = {
    paymentMethods: Array<CreditCardInfo>
    transactionHistory: Array<{
        id: string
        item: string
        status: string
        amount: number
        date: number
    }>
    currentPlan: {
        plan: string
        status: string
        billingCycle: string
        nextPaymentDate: number
        amount: number
    }
}

export type GetSettingsIntegrationResponse = Integration[]
