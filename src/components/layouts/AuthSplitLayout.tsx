import type { ReactNode } from 'react'
import PublicShell from './PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import BrandMarquee from '@/components/shared/BrandMarquee'
import TestimonialPanel from '@/components/shared/TestimonialPanel'

/**
 * Split auth layout: beige form card (with partner marquee at its foot) on the
 * left, rotating testimonial on the right. Used by Sign up / Recovery / Reset.
 */
export default function AuthSplitLayout({ children }: { children: ReactNode }) {
    return (
        <PublicShell mainClassName="flex-col gap-[40px] p-4 md:p-[40px] lg:flex-row">
            <BeigeCard className="flex flex-1 flex-col justify-between">
                <div className="px-6 pt-12 md:px-[50px] md:pr-10 md:pt-[90px]">
                    {children}
                </div>
                <BrandMarquee />
            </BeigeCard>

            <section className="flex flex-1 items-center justify-center px-2 py-6 md:px-[60px] md:py-[50px]">
                <div className="w-full max-w-[640px]">
                    <TestimonialPanel />
                </div>
            </section>
        </PublicShell>
    )
}
