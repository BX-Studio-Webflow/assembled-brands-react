import { useSearchParams } from 'react-router'
import QualifyIntro from './QualifyIntro'
import QualifyStep1 from './QualifyStep1'
import QualifyStep2 from './QualifyStep2'
import QualifyStep3 from './QualifyStep3'

/** Legacy `/onboarding-wizard` with `?step=` query routing. */
export default function OnboardingWizard() {
    const [params] = useSearchParams()
    const step = params.get('step')

    if (step === 'start') return <QualifyIntro />
    if (step === '2') return <QualifyStep2 />
    if (step === 'step-3') return <QualifyStep3 />
    return <QualifyStep1 />
}
