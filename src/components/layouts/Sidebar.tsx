import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { LuChevronDown, LuEllipsis, LuEllipsisVertical, LuLogOut, LuX } from 'react-icons/lu'
import { navigation, warmNavigation, isExternalNavUrl, type NavGroup } from '@/configs/navigation'
import LogoMark from '@/components/shared/LogoMark'
import ProgressBar from '@/components/ui/ProgressBar'
import Skeleton from '@/components/ui/Skeleton'
import { useAuth } from '@/lib/auth'
import { useSidebarProgress } from '@/lib/hooks/useSidebarProgress'
import { cx } from '@/lib/utils'
import sidenavHexagon from '@/assets-ab/sidenav-hexagon.svg'
import sidenavToggle from '@/assets-ab/sidenav-toggle.svg'

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
        if (isExternalNavUrl(dest)) {
            return (
                <a
                    href={dest}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={group.label}
                    aria-label={group.label}
                    className="flex h-8 items-center justify-center"
                    onClick={onNavigate}
                >
                    <Icon />
                </a>
            )
        }
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
        const dest = group.to ?? '#'
        if (isExternalNavUrl(dest)) {
            return (
                <a
                    href={dest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[10px]"
                    onClick={onNavigate}
                >
                    <span className="flex w-5 shrink-0 justify-center">
                        <Icon />
                    </span>
                    <span className="ab-h4 text-offwhite">{group.label}</span>
                </a>
            )
        }
        return (
            <NavLink
                to={dest}
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

function AccountMenu({
    collapsed = false,
    menuPlacement = 'up',
    onNavigate,
}: {
    collapsed?: boolean
    menuPlacement?: 'up' | 'down'
    onNavigate?: () => void
}) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function onPointerDown(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', onPointerDown)
        return () => document.removeEventListener('mousedown', onPointerDown)
    }, [open])

    function handleLogout() {
        logout()
        onNavigate?.()
        setOpen(false)
        navigate('/login?error=logged-out')
    }

    return (
        <div ref={menuRef} className="relative shrink-0">
            <button
                type="button"
                aria-label="Account menu"
                aria-expanded={open}
                className="text-ink/60 hover:text-ink"
                onClick={() => setOpen((v) => !v)}
            >
                {collapsed ? (
                    <LuEllipsis className="size-4" />
                ) : (
                    <LuEllipsisVertical className="size-4" />
                )}
            </button>
            {open && (
                <div
                    className={cx(
                        'absolute z-[200] min-w-[160px] rounded border border-ink/10 bg-white py-1 shadow-lg',
                        menuPlacement === 'down'
                            ? collapsed
                                ? 'left-1/2 top-full mt-2 -translate-x-1/2'
                                : 'left-0 top-full mt-2'
                            : collapsed
                              ? 'bottom-full left-1/2 mb-2 -translate-x-1/2'
                              : 'bottom-full right-0 mb-2',
                    )}
                >
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left ab-text-s text-ink hover:bg-beige/60"
                        onClick={handleLogout}
                    >
                        <LuLogOut className="size-4 shrink-0" />
                        Log out
                    </button>
                </div>
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
            className="shrink-0 transition-opacity hover:opacity-90"
            onClick={onToggle}
        >
            <img
                aria-hidden
                src={sidenavToggle}
                alt=""
                className={cx('size-[37px]', !collapsed && '-scale-x-100')}
            />
        </button>
    )
}

export default function Sidebar({
    onNavigate,
    variant = 'default',
    onClose,
}: {
    onNavigate?: () => void
    variant?: 'default' | 'drawer'
    onClose?: () => void
}) {
    const { user } = useAuth()
    const { pathname } = useLocation()
    const navItems = pathname.startsWith('/warm') ? warmNavigation : navigation
    const isDrawer = variant === 'drawer'
    const [collapsed, setCollapsed] = useState(false)
    const effectiveCollapsed = isDrawer ? false : collapsed
    const menuPlacement = isDrawer ? 'down' : 'up'
    const { data: sidebarData, isLoading } = useSidebarProgress()

    const progress = sidebarData?.percentage ?? 0
    const name =
        sidebarData?.userName ??
        (user
            ? `${user.first_name || 'Full'} ${user.last_name || 'Name'}`.trim()
            : 'Full Name')
    const email = sidebarData?.userEmail ?? user?.email ?? 'hello@company.com'

    return (
        <aside
            className={cx(
                'relative flex h-full max-h-screen flex-col bg-sidebar text-offwhite transition-[width] duration-200 ease-out',
                isDrawer
                    ? 'w-full overflow-hidden p-[25px]'
                    : cx(
                          'p-[25px]',
                          effectiveCollapsed ? 'w-[90px]' : 'w-[324px]',
                      ),
            )}
        >
            {/* Hex mesh backdrop (Figma side-nav asset) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                    aria-hidden
                    src={sidenavHexagon}
                    alt=""
                    className="absolute bottom-0 left-0 h-[min(100%,549px)] w-[275px] max-w-none object-cover object-left-bottom"
                />
            </div>

            {/* Floating collapse toggle, anchored on the right edge (desktop only) */}
            <div className="absolute right-0 top-[25px] z-30 hidden translate-x-1/2 lg:block">
                <CollapseToggle
                    collapsed={effectiveCollapsed}
                    onToggle={() => setCollapsed((v) => !v)}
                />
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
                <div className="flex min-h-0 flex-1 flex-col gap-[60px]">
                    <div
                        className={cx(
                            'flex shrink-0',
                            isDrawer && 'items-center justify-between gap-3',
                            effectiveCollapsed && !isDrawer && 'justify-center',
                        )}
                    >
                        <LogoMark compact={effectiveCollapsed} tone="light" />
                        {isDrawer && onClose && (
                            <button
                                type="button"
                                aria-label="Close menu"
                                className="flex size-[37px] shrink-0 items-center justify-center rounded-full border border-ink bg-offwhite text-ink shadow-[2px_2px_0_0_#262626]"
                                onClick={onClose}
                            >
                                <LuX className="size-5" strokeWidth={2} />
                            </button>
                        )}
                    </div>

                    <nav
                        className={cx(
                            'flex min-h-0 flex-1 flex-col gap-[25px] overflow-y-auto overscroll-contain pr-1',
                            effectiveCollapsed && 'items-center',
                        )}
                    >
                        {navItems.map((group) => (
                            <GroupBlock
                                key={group.label}
                                group={group}
                                collapsed={effectiveCollapsed}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>
                </div>

                <div
                    className={cx(
                        'flex shrink-0 flex-col gap-[46px] overflow-visible',
                        effectiveCollapsed && 'items-center',
                    )}
                >
                    {isLoading ? (
                        effectiveCollapsed ? (
                            <Skeleton className="h-4 w-8 bg-offwhite/20" />
                        ) : (
                            <Skeleton className="h-2 w-[249px] max-w-full bg-offwhite/20" />
                        )
                    ) : effectiveCollapsed ? (
                        <p className="ab-h5 text-center uppercase text-offwhite">
                            {progress}%
                        </p>
                    ) : (
                        <div className="w-[249px] max-w-full">
                            <ProgressBar value={progress} />
                        </div>
                    )}

                    {/* Beige chamfered footer panel (Figma: bottom "Subtract" shape) */}
                    <div
                        className="relative z-20 -mx-[25px] -mb-[25px] self-stretch overflow-visible bg-beige px-[25px] py-[20px]"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
                        }}
                    >
                        {effectiveCollapsed ? (
                            <div className="flex flex-col items-center gap-[20px]">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-[12px] font-semibold text-ink">
                                    {initials(name)}
                                </span>
                                <AccountMenu
                                    collapsed
                                    menuPlacement={menuPlacement}
                                    onNavigate={onNavigate}
                                />
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
                                <AccountMenu
                                    menuPlacement={menuPlacement}
                                    onNavigate={onNavigate}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}
