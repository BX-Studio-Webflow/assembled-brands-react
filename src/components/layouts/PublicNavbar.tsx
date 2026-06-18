import type { ReactNode } from 'react'
import Logo from '@/components/shared/Logo'

export default function PublicNavbar({ right }: { right?: ReactNode }) {
    return (
        <header className="sticky top-0 z-20 w-full bg-offwhite/90 backdrop-blur-[5px]">
            <div className="flex items-center justify-between px-6 py-4 md:px-[50px]">
                <Logo />
                {right ? <div className="flex items-center gap-4">{right}</div> : null}
            </div>
        </header>
    )
}
