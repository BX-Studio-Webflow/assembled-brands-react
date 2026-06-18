import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import PillButton from '@/components/ui/PillButton'

export default function ClaimAccountGetStarted() {
    const navigate = useNavigate()

    return (
        <CenteredCardLayout title="Account claimed">
            <p className="ab-serif mb-[30px]">
                Your account is ready. Continue building your application.
            </p>
            <PillButton onClick={() => navigate('/finance-company-profile')}>
                Get started
            </PillButton>
        </CenteredCardLayout>
    )
}
