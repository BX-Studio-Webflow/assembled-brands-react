export type SignInCredential = {
    email: string
    password: string
}

export type SignUpCredential = {
    name: string
    email: string
    password: string
    phone: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type User = {
    id: number
    email: string
    name: string
    createdAt: string
    is_verified: boolean
    role: string
    phone: string
    profile_picture: string
    authority: string[]
    bio: string | null
    is_banned: boolean
    is_deleted: boolean
    stripe_account_id: string | null
    subscription_status: 'active' | 'inactive' | 'expired'
    auth_provider: 'google' | 'email'
}

export type Token = {
    accessToken: string
}

export type SignInResponse = {
    data: {
        token: string
        user: User
    }
}

export type SignUpResponse = {
    data: {
        token: string
        user: User
    }
}

export type BusinessDetails = {
    name: string
    email: string
    phone: string
    address: string
    logo: string
    logoFileName: string
}
export type AuthResponse = {
    status: 'success' | 'failed'
    message: string
}

export type BusinessDetailsResponse = {
    message: string
    business: {
        id: number
        name: string
        address: string
        phone: string
        email: string
        description: string
        logo_asset_id: number
        user_id: number
        updated_at: string
        created_at: string
        logo: string
        teamDetails: {
            id: number
            team_id: number
            user_id: number
            role: string
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
}

export type AuthResult = Promise<AuthResponse>
export type BusinessDetailsResult = Promise<BusinessDetailsResponse>

export type OauthSignInCallbackPayload = {
    onSignIn: (token: Token, user?: User) => void
    redirect: () => void
}

export type UploadProfileImageBody = {
    imageBase64: string
    fileName: string
}

export type ResetPasswordInAppBody = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export type InitiateStripeConnectResponse = {
    url: string
}
