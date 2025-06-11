import { createContext } from 'react'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    User,
    OauthSignInCallbackPayload,
    BusinessDetails,
} from '@/@types/auth'

type Auth = {
    authenticated: boolean
    user: User
    signIn: (values: SignInCredential) => AuthResult
    signUp: (values: SignUpCredential) => AuthResult
    saveBusinessDetails: (values: BusinessDetails) => AuthResult
    signOut: () => void
    oAuthSignIn: (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => void
}

const defaultFunctionPlaceHolder = async (): AuthResult => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    return {
        status: 'success',
        message: '',
    }
}

const defaultOAuthSignInPlaceHolder = (
    callback: (payload: OauthSignInCallbackPayload) => void,
): void => {
    callback({
        onSignIn: () => {},
        redirect: () => {},
    })
}

const AuthContext = createContext<Auth>({
    authenticated: false,
    user: {
        id: 0,
        email: '',
        name: '',
        createdAt: '',
        is_verified: false,
        role: '',
        phone: '',
        profile_picture: '',
        bio: '',
        is_banned: false,
        is_deleted: false,
        auth_provider: 'email',
        stripe_account_id: '',
        subscription_status: 'inactive',
        authority: [],
    },
    signIn: async () => defaultFunctionPlaceHolder(),
    signUp: async () => defaultFunctionPlaceHolder(),
    saveBusinessDetails: async () => defaultFunctionPlaceHolder(),
    signOut: () => {},
    oAuthSignIn: defaultOAuthSignInPlaceHolder,
})

export default AuthContext
