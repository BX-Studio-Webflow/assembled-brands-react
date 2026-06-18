import { useState } from 'react'
import { Outlet } from 'react-router'
import { LuMenu } from 'react-icons/lu'
import Sidebar from './Sidebar'
import LogoMark from '@/components/shared/LogoMark'
import portalBrandMark from '@/assets-ab/portal-brand-mark.svg'

export default function PortalLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-offwhite">
            {/* Desktop sidebar */}
            <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
                <Sidebar />
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-ink/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10 h-full w-[min(324px,100vw)] shadow-xl">
                        <Sidebar
                            variant="drawer"
                            onNavigate={() => setMobileOpen(false)}
                            onClose={() => setMobileOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile top bar */}
                <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 lg:hidden">
                    <LogoMark tone="dark" size="mobile" />
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="text-ink"
                        onClick={() => setMobileOpen(true)}
                    >
                        <LuMenu className="size-7" />
                    </button>
                </div>

                <div className="flex-1 p-5 md:p-[45px]">
                    <div className="flex w-full flex-col gap-[30px]">
                        <Outlet />
                    </div>
                </div>
            </div>

            <a
                href="https://assembledbrands.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Assembled Brands"
                className="fixed bottom-6 right-6 z-30 flex size-[43px] items-center justify-center transition-transform hover:scale-105 md:bottom-[50px] md:right-[50px]"
            >
                <img
                    aria-hidden
                    src={portalBrandMark}
                    alt=""
                    className="size-[43px]"
                />
            </a>
        </div>
    )
}
