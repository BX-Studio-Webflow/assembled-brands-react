// Utility to return a stable avatar color class set from a small palette
// based on a string/number key. Ensures consistent colors across re-renders.

const avatarColorOptions = [
    [
        'bg-indigo-100',
        'text-indigo-600',
        'dark:bg-indigo-500/20',
        'dark:text-indigo-100',
    ],
    [
        'bg-emerald-100',
        'text-emerald-600',
        'dark:bg-emerald-500/20',
        'dark:text-emerald-100',
    ],
    [
        'bg-rose-100',
        'text-rose-600',
        'dark:bg-rose-500/20',
        'dark:text-rose-100',
    ],
    [
        'bg-amber-100',
        'text-amber-600',
        'dark:bg-amber-500/20',
        'dark:text-amber-100',
    ],
    ['bg-sky-100', 'text-sky-600', 'dark:bg-sky-500/20', 'dark:text-sky-100'],
] as const

export function getAvatarColorClasses(key: number | string): string {
    const str = String(key)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0 // keep 32-bit
    }
    const idx = Math.abs(hash) % avatarColorOptions.length
    const [bg, text, darkBg, darkText] = avatarColorOptions[idx]
    return `${bg} ${text} ${darkBg} ${darkText}`
}

export type AvatarColorTuple = (typeof avatarColorOptions)[number]
export const AVATAR_COLOR_PALETTE: ReadonlyArray<AvatarColorTuple> =
    avatarColorOptions
