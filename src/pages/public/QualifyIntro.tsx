import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import PillButton from '@/components/ui/PillButton'

export default function QualifyIntro() {
    const navigate = useNavigate()
    return (
        <CenteredCardLayout maxWidth={620}>
            <div className="flex flex-col gap-6">
                <h1 className="ab-display">Let’s get started!</h1>
                <div className="ab-serif space-y-1">
                    <p>Don’t worry if you can’t finish everything in one go.</p>
                    <p>We’ll automatically save your progress.</p>
                    <p>Minimum qualifications for Assembled Brands are …</p>
                    <p>$1MM+ in trailing twelve-month revenue</p>
                    <p>At least 12 months in business</p>
                    <p>A registered US-based business entity</p>
                    <p>
                        Heads up, we’ll be asking about your business, key
                        individuals, and banking info
                    </p>
                </div>
                <div>
                    <PillButton onClick={() => navigate('/onboarding-wizard')}>
                        Start application ~10 minutes
                    </PillButton>
                </div>
            </div>
        </CenteredCardLayout>
    )
}
