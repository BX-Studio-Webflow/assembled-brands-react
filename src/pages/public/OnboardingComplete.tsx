import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import PillButton from '@/components/ui/PillButton'

export default function OnboardingComplete() {
    const navigate = useNavigate()

    return (
        <CenteredCardLayout title="You're all set">
            <p className="ab-serif mb-[30px]">
                Your onboarding is complete. Continue to your application portal.
            </p>
            <PillButton onClick={() => navigate('/finance-company-profile')}>
                Continue
            </PillButton>
        </CenteredCardLayout>
    )
}
