import type { ReactNode } from 'react'
import PublicNavbar from './PublicNavbar'

/** Off-white page with the top brand navbar — base for all public screens. */
export default function PublicShell({
    children,
    navRight,
    mainClassName = '',
}: {
    children: ReactNode
    navRight?: ReactNode
    mainClassName?: string
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <PublicNavbar right={navRight} />
            <main className={`flex flex-1 ${mainClassName}`}>{children}</main>
        </div>
    )
}
