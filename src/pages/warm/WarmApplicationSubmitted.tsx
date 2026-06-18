import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import { SUPPORT_URL } from '@/configs/navigation'

export default function WarmApplicationSubmitted() {
    return (
        <>
            <PageHeader title="Application Submitted!" />
            <PortalCard>
                <div className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]">
                    <div className="flex flex-col gap-[15px]">
                        <h2 className="ab-h3">Next steps</h2>
                        <p className="ab-serif text-ink">
                            Our underwriting team is already reviewing your
                            financial package. Your originator will reach out to
                            discuss how we can support your growth with flexible,
                            scalable asset-based funding tailored to your brand.
                        </p>
                    </div>
                    <p className="ab-serif text-ink">
                        Questions in the meantime? Drop us a line at{' '}
                        <a
                            className="border-b border-ink text-ink"
                            href="mailto:sales@assembledbrands.com"
                        >
                            sales@assembledbrands.com
                        </a>
                        .
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <a
                            href={SUPPORT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ab-label border-b border-ink text-ink"
                        >
                            Support
                        </a>
                        <Link
                            to="/warm/invite-team-members"
                            className="ab-label border-b border-ink text-ink"
                        >
                            Invite team members
                        </Link>
                    </div>
                </div>
            </PortalCard>
        </>
    )
}
