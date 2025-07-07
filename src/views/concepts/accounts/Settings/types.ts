export type View =
    | 'profile'
    | 'security'
    //| 'notification'
    | 'billing'
    | 'team'
    | 'business'

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
        dial_code: string
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
        dial_code: string
        role: 'host' | 'master' | 'owner' | 'guest'
        subscription_status: 'active' | 'inactive' | 'expired'
        is_banned: boolean
        is_deleted: boolean
        profile_picture: string
    }
}

export type GetSettingsNotificationResponse = {
    email: string[]
    desktop: boolean
    unreadMessageBadge: boolean
    notifymeAbout: string
}

export type GetSettingsBillingResponse = {
    data: {
        subscriptions: Array<{
            id: number
            created_at: string
            user_id: number
            object: string
            amount_subtotal: number
            amount_total: number
            session_id: string
            cancel_url: string
            success_url: string
            created: number
            currency: string
            mode: string
            payment_status: string
            status: string
            subscription_id: string | null
        }>
        cardDetails: Array<{
            id: string
            object: string
            allow_redisplay: string
            billing_details: {
                address: {
                    city: string | null
                    country: string
                    line1: string | null
                    line2: string | null
                    postal_code: string | null
                    state: string | null
                }
                email: string
                name: string
                phone: string | null
                tax_id: string | null
            }
            card: {
                brand: string
                checks: {
                    address_line1_check: string | null
                    address_postal_code_check: string | null
                    cvc_check: string
                }
                country: string
                display_brand: string
                exp_month: number
                exp_year: number
                fingerprint: string
                funding: string
                generated_from: string | null
                last4: string
                networks: {
                    available: string[]
                    preferred: string | null
                }
                regulated_status: string
                three_d_secure_usage: {
                    supported: boolean
                }
                wallet: string | null
            }
            created: number
            customer: string
            livemode: boolean
            metadata: Record<string, unknown>
            type: string
        }>
    }
}

export type GetSettingsIntegrationResponse = Integration[]
