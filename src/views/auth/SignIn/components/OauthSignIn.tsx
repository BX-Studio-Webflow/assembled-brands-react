import Button from '@/components/ui/Button'
import { useAuth } from '@/auth'
import { apiGoogleInitiate, apiGoogleContinue } from '@/services/AuthService'
import { useEffect } from 'react'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (code) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGoogleContinue(code)
                    if (resp?.token && resp?.user) {
                        onSignIn({ accessToken: resp.token }, resp.user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }, [oAuthSignIn, setMessage])

    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            try {
                const resp = await apiGoogleInitiate()
                if (resp?.authUrl) {
                    window.location.href = resp.authUrl
                }
            } catch (error) {
                setMessage?.((error as string)?.toString() || '')
            }
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                className="flex-1"
                type="button"
                onClick={handleGoogleSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span>Google</span>
                </div>
            </Button>
        </div>
    )
}

export default OauthSignIn
