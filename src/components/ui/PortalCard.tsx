import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

/** Beige content panel used inside portal pages. */
export default function PortalCard({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={cx('bg-beige px-[24px] py-[60px]', className)}>
            {children}
        </div>
    )
}
