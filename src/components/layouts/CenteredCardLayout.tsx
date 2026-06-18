import type { ReactNode } from 'react'
import PublicShell from './PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import loginHexagon from '@/assets-ab/login-hexagon.png'

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
            <BeigeCard className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 md:pb-[56px] md:pl-[50px] md:pr-[40px] md:pt-[50px]">
                <img
                    aria-hidden
                    src={loginHexagon}
                    alt=""
                    className="pointer-events-none absolute -bottom-16 -right-10 z-0 hidden h-auto w-[566px] max-w-[55%] opacity-50 lg:block"
                />
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
