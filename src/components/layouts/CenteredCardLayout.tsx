import type { ReactNode } from 'react'
import PublicShell from './PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import HexPattern from '@/components/shared/HexPattern'

/** Beige card centered in the viewport with the decorative hex pattern.
 *  Used by the qualification intro and step pages. */
export default function CenteredCardLayout({
    children,
    title,
    maxWidth = 543,
}: {
    children: ReactNode
    title?: string
    maxWidth?: number
}) {
    return (
        <PublicShell mainClassName="p-4 md:p-[40px]">
            <BeigeCard className="flex flex-1 items-center justify-center px-6 py-12 md:pb-[56px] md:pl-[50px] md:pr-[40px] md:pt-[50px]">
                <HexPattern className="pointer-events-none absolute -bottom-16 -right-10 hidden h-[520px] w-[480px] opacity-60 lg:block" />
                <div
                    className="relative z-10 mx-auto w-full"
                    style={{ maxWidth }}
                >
                    {title && (
                        <h1 className="ab-h3 mb-[30px]">{title}</h1>
                    )}
                    {children}
                </div>
            </BeigeCard>
        </PublicShell>
    )
}
