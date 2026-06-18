import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuEllipsis, LuEllipsisVertical } from 'react-icons/lu'
import { navigation, warmNavigation, type NavGroup } from '@/configs/navigation'
import LogoMark from '@/components/shared/LogoMark'
import HexPattern from '@/components/shared/HexPattern'
import ProgressBar from '@/components/ui/ProgressBar'
import { useAuth } from '@/lib/auth'
import { cx } from '@/lib/utils'

function initials(name: string) {
    return name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

function GroupBlock({
    group,
    collapsed,
    onNavigate,
}: {
    group: NavGroup
    collapsed: boolean
    onNavigate?: () => void
}) {
    const { pathname } = useLocation()
    const Icon = group.icon
    const containsActive =
        group.children?.some((c) => pathname.startsWith(c.to)) ?? false
    const [open, setOpen] = useState(containsActive)

    // Collapsed: render only the icon, linking to the group's destination.
    if (collapsed) {
        const dest = group.to ?? group.children?.[0]?.to ?? '#'
        return (
            <NavLink
                to={dest}
                title={group.label}
                aria-label={group.label}
                className="flex h-8 items-center justify-center"
                onClick={onNavigate}
            >
                <Icon />
            </NavLink>
        )
    }

    if (!group.children) {
        return (
            <NavLink
                to={group.to ?? '#'}
                className="flex items-center gap-[10px]"
                onClick={onNavigate}
            >
                {({ isActive }) => (
                    <>
                        <span className="flex w-5 shrink-0 justify-center">
                            <Icon />
                        </span>
                        <span
                            className="ab-h4"
                            style={{ color: isActive ? group.accent : '#fffbf5' }}
                        >
                            {group.label}
                        </span>
                    </>
                )}
            </NavLink>
        )
    }

    return (
        <div className="flex flex-col gap-[20px]">
            <button
                type="button"
                className="flex w-full items-center gap-[10px] text-left"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="flex w-5 shrink-0 justify-center">
                    <Icon />
                </span>
                <span className="ab-h4 flex-1 text-offwhite">{group.label}</span>
                <LuChevronDown
                    className={cx(
                        'size-4 text-offwhite/60 transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {open && (
                <ul className="flex flex-col gap-[20px] pl-[32px]">
                    {group.children.map((leaf) => (
                        <li key={leaf.to}>
                            <NavLink to={leaf.to} onClick={onNavigate}>
                                {({ isActive }) => (
                                    <span
                                        className="ab-h5 uppercase"
                                        style={{
                                            color: isActive
                                                ? group.accent
                                                : '#fffbf5',
                                        }}
                                    >
                                        {leaf.label}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function CollapseToggle({
    collapsed,
    onToggle,
}: {
    collapsed: boolean
    onToggle: () => void
}) {
    return (
        <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex size-[35px] shrink-0 items-center justify-center rounded-full border border-ink/10 bg-offwhite text-ink shadow-md transition-colors hover:bg-white"
            onClick={onToggle}
        >
            {collapsed ? (
                <LuChevronRight className="size-4" />
            ) : (
                <LuChevronLeft className="size-4" />
            )}
        </button>
    )
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const { user } = useAuth()
    const { pathname } = useLocation()
    const navItems = pathname.startsWith('/warm') ? warmNavigation : navigation
    const [collapsed, setCollapsed] = useState(false)
    const name = user
        ? `${user.first_name || 'Full'} ${user.last_name || 'Name'}`.trim()
        : 'Full Name'
    const email = user?.email ?? 'hello@company.com'

    return (
        <aside
            className={cx(
                'relative flex h-full flex-col bg-sidebar p-[25px] text-offwhite transition-[width] duration-200 ease-out',
                collapsed ? 'w-[90px]' : 'w-[324px]',
            )}
        >
            {/* Clipped hex backdrop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <HexPattern
                    stroke="#ffffff"
                    opacity={0.05}
                    className="absolute -left-12 bottom-28 h-[420px] w-[400px]"
                />
            </div>

            {/* Floating collapse toggle, anchored on the right edge (desktop only) */}
            <div className="absolute right-0 top-[25px] z-30 hidden translate-x-1/2 lg:block">
                <CollapseToggle
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((v) => !v)}
                />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex flex-col gap-[60px]">
                    <div className={cx('flex', collapsed && 'justify-center')}>
                        <LogoMark compact={collapsed} tone="light" />
                    </div>

                    <nav
                        className={cx(
                            'flex flex-col gap-[25px] overflow-y-auto',
                            collapsed && 'items-center',
                        )}
                    >
                        {navItems.map((group) => (
                            <GroupBlock
                                key={group.label}
                                group={group}
                                collapsed={collapsed}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>
                </div>

                <div
                    className={cx(
                        'flex flex-col gap-[46px]',
                        collapsed && 'items-center',
                    )}
                >
                    {collapsed ? (
                        <p className="ab-h5 text-center uppercase text-offwhite">
                            10%
                        </p>
                    ) : (
                        <div className="w-[249px] max-w-full">
                            <ProgressBar value={10} />
                        </div>
                    )}

                    {/* Beige chamfered footer panel (Figma: bottom "Subtract" shape) */}
                    <div
                        className="-mx-[25px] -mb-[25px] self-stretch bg-beige px-[25px] py-[20px]"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
                        }}
                    >
                        {collapsed ? (
                            <div className="flex flex-col items-center gap-[20px]">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-[12px] font-semibold text-ink">
                                    {initials(name)}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Account menu"
                                    className="text-ink/60 hover:text-ink"
                                >
                                    <LuEllipsis className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-[15px]">
                                <span className="flex min-w-0 items-center gap-[15px]">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-[12px] font-semibold text-ink">
                                        {initials(name)}
                                    </span>
                                    <span className="flex min-w-0 flex-col gap-[5px]">
                                        <span className="truncate font-serif text-[16px] leading-[1.5] tracking-[-0.02em] text-ink">
                                            {name}
                                        </span>
                                        <span className="ab-text-s truncate text-ink/70">
                                            {email}
                                        </span>
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    aria-label="Account menu"
                                    className="shrink-0 text-ink/60 hover:text-ink"
                                >
                                    <LuEllipsisVertical className="size-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}
