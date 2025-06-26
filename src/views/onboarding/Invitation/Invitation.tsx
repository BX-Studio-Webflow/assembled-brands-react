import { useEffect, useState } from 'react'
import CardSection from './components/CardSection'
import Split from '@/components/layouts/AuthLayout/Split'

export const InvitationBase = () => {
    const [params, setParams] = useState<{
        invitation_id: string
        team_id: string
        team_name: string
        inviter_name: string
        timestamp: string
    }>({
        invitation_id: '',
        team_id: '',
        team_name: '',
        inviter_name: '',
        timestamp: '',
    })

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const invitation_id = urlParams.get('invitation_id')
        const team_id = urlParams.get('team_id')
        const team_name = urlParams.get('team_name')
        const inviter_name = urlParams.get('inviter_name')
        const timestamp = urlParams.get('timestamp')
        if (
            invitation_id &&
            team_id &&
            team_name &&
            inviter_name &&
            timestamp
        ) {
            setParams({
                invitation_id,
                team_id,
                team_name,
                inviter_name,
                timestamp,
            })
        }
    }, [])

    return (
        <div className="min-h-screen h-screen">
            <Split className="h-full">
                <div>
                    <CardSection
                        data={{
                            invitation_id: params.invitation_id,
                            team_id: params.team_id,
                            team_name: params.team_name,
                            inviter_name: params.inviter_name,
                            timestamp: params.timestamp,
                        }}
                    />
                </div>
            </Split>
        </div>
    )
}

const Gateway = () => {
    return <InvitationBase />
}

export default Gateway
