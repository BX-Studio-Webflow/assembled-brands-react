import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import PillButton from '@/components/ui/PillButton'
import {
    apiAcceptTeamInvitation,
    apiGetInvitation,
    apiRejectTeamInvitation,
} from '@/services/TeamService'

export default function AcceptTeamInvitation() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const invitationId = Number(params.get('invitation_id'))
    const [message, setMessage] = useState<string | null>(null)
    const [teamName, setTeamName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!invitationId) return
        void apiGetInvitation(invitationId)
            .then((res) => {
                setMessage(res.message ?? null)
                setTeamName(res.team?.name ?? 'the team')
            })
            .catch(() => setError('Invitation not found'))
    }, [invitationId])

    async function accept() {
        setLoading(true)
        try {
            await apiAcceptTeamInvitation(invitationId)
            navigate('/warm/finance-my-applications')
        } catch (err) {
            setError((err as { message?: string }).message ?? 'Accept failed')
        } finally {
            setLoading(false)
        }
    }

    async function reject() {
        setLoading(true)
        try {
            await apiRejectTeamInvitation(invitationId)
            navigate('/login')
        } catch (err) {
            setError((err as { message?: string }).message ?? 'Reject failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <CenteredCardLayout title="Team invitation">
            <p className="ab-serif mb-4">
                You have been invited to join {teamName}.
            </p>
            {message && <p className="ab-text-s mb-6 text-ink/70">{message}</p>}
            {error && <p className="ab-text-m mb-4 text-coral">{error}</p>}
            <div className="flex flex-col gap-[10px]">
                <PillButton loading={loading} onClick={() => void accept()}>
                    Accept invitation
                </PillButton>
                <PillButton variant="muted" onClick={() => void reject()}>
                    Decline
                </PillButton>
            </div>
        </CenteredCardLayout>
    )
}
