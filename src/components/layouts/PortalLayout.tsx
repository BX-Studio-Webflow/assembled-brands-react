import { useState } from 'react'
import { Outlet } from 'react-router'
import { LuMenu, LuX, LuMessageSquare } from 'react-icons/lu'
import Sidebar from './Sidebar'
import LogoMark from '@/components/shared/LogoMark'

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
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-ink/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full">
                        <Sidebar onNavigate={() => setMobileOpen(false)} />
                    </div>
                    <button
                        type="button"
                        aria-label="Close menu"
                        className="absolute right-4 top-4 text-offwhite"
                        onClick={() => setMobileOpen(false)}
                    >
                        <LuX className="size-6" />
                    </button>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile top bar */}
                <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 lg:hidden">
                    <LogoMark tone="dark" />
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="text-ink"
                        onClick={() => setMobileOpen(true)}
                    >
                        <LuMenu className="size-6" />
                    </button>
                </div>

                <div className="flex-1 p-5 md:p-[45px]">
                    <div className="flex w-full flex-col gap-[30px]">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Intercom-style helper button */}
            <button
                type="button"
                aria-label="Get help"
                className="fixed bottom-[50px] right-[50px] z-30 flex size-[43px] items-center justify-center rounded-xl bg-ink text-offwhite shadow-lg transition-transform hover:scale-105"
            >
                <LuMessageSquare className="size-5" />
            </button>
        </div>
    )
}
