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
        id: number
        name: string
        address: string
        phone: string
        email: string
        description: string | null
        logo_asset_id: number
        user_id: number
        updated_at: string
        created_at: string
        logo: string
        teamDetails: {
            id: number
            team_id: number
            user_id: number
            role: 'host' | 'master' | 'owner' | 'guest'
            created_at: string
            updated_at: string
            team: {
                id: number
                name: string
                created_at: string
                updated_at: string
            }
            user: {
                email: string
                name: string
            }
        }
    }
    user: {
        email: string
        name: string
        phone: string
        role: 'host' | 'master' | 'owner' | 'guest'
        subscription_status: 'active' | 'inactive' | 'expired'
        is_banned: boolean
        is_deleted: boolean
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
