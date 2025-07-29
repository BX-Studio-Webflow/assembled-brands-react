import { useRef, useImperativeHandle, useState } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import {
    apiSignIn,
    apiSignOut,
    apiSignUp,
    apiSaveBusinessDetails,
} from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { ONBOARDING_PREFIX_PATH } from '@/constants/route.constant'
import { useNavigate } from 'react-router'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
    BusinessDetails,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])

    return <></>
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken()
    const [tokenState, setTokenState] = useState(token)

    const authenticated = Boolean(tokenState && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)

        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        )
    }

    const redirectToOnboarding = () => {
        navigatorRef.current?.navigate(
            `${ONBOARDING_PREFIX_PATH}/business-onboarding`,
        )
    }

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)

        if (user) {
            setUser(user)
        }
    }

    const handleSignOut = () => {
        setToken('')
        setUser({
            id: 0,
            email: '',
            name: '',
            profile_picture: '',
            createdAt: '',
            is_verified: false,
            role: '',
            authority: [],
            phone: '',
            bio: null,
            is_banned: false,
            is_deleted: false,
            dial_code: '',
            stripe_account_id: null,
            subscription_status: 'inactive',
            auth_provider: 'email',
        })
        setSessionSignedIn(false)
    }

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const resp = await apiSignIn(values)
            if (resp?.data) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign in',
            }
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { error?: string; message?: string } }
            }

            return {
                status: 'failed',
                message:
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    String(error),
            }
        }
    }

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const resp = await apiSignUp(values)
            if (resp?.data) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirectToOnboarding()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign up',
            }
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { error?: string; message?: string } }
            }

            return {
                status: 'failed',
                message:
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    String(error),
            }
        }
    }

    const saveBusinessDetails = async (values: BusinessDetails): AuthResult => {
        try {
            const resp = await apiSaveBusinessDetails(values)
            if (resp?.data) {
                handleSignIn({ accessToken: resp.data.token }, resp.data.user)
                redirect()
                return {
                    status: 'success',
                    message: '',
                }
            }
            return {
                status: 'failed',
                message: 'Unable to sign up',
            }
        } catch (error: unknown) {
            const err = error as {
                response?: { data?: { error?: string; message?: string } }
            }

            return {
                status: 'failed',
                message:
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    String(error),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            localStorage.removeItem('sessionUser')
            handleSignOut()
            navigatorRef.current?.navigate('/')
        }
    }
    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                saveBusinessDetails,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
