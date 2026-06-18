import { useNavigate } from 'react-router'
import PublicShell from '@/components/layouts/PublicShell'
import HexPattern from '@/components/shared/HexPattern'
import PillButton from '@/components/ui/PillButton'

export default function NotAFit() {
    const navigate = useNavigate()
    return (
        <PublicShell mainClassName="p-4 md:p-[40px]">
            <div
                className="relative flex flex-1 items-center overflow-hidden bg-ink px-6 py-16 text-offwhite md:px-12"
                style={{
                    clipPath:
                        'polygon(96px 0, 100% 0, 100% 100%, 0 100%, 0 72px)',
                }}
            >
                <HexPattern
                    stroke="#ffffff"
                    opacity={0.06}
                    className="pointer-events-none absolute -right-10 bottom-0 hidden h-[520px] w-[480px] lg:block"
                />
                <div className="relative z-10 mx-auto w-full max-w-[760px]">
                    <h1 className="ab-display !text-offwhite">
                        We might not be a good fit for your company, yet.
                    </h1>
                    <div className="ab-serif mt-6 space-y-1 !text-offwhite/90">
                        <p>
                            If you are a new company in the process of scaling, or
                            you’d like to provide additional documentation for our
                            team to review, please reach out.
                        </p>
                        <p>
                            Otherwise, we’d be happy to stay in touch and
                            re-evaluate at another time.
                        </p>
                    </div>
                    <div className="mt-8">
                        <PillButton
                            variant="solid"
                            className="!border-offwhite !bg-offwhite !text-ink"
                            onClick={() => navigate('/')}
                        >
                            Back to home
                        </PillButton>
                    </div>
                </div>
            </div>
        </PublicShell>
    )
}
