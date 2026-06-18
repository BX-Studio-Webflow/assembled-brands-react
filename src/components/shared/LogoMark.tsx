import mark from '@/assets-ab/logo-mark.png'

/** Hexagon mark + wordmark lockup. `tone` controls the wordmark color so it can
 *  sit on the dark sidebar (light) or a light surface (dark). When `compact` is
 *  set, only the hexagon mark is shown (used by the collapsed sidebar). */
export default function LogoMark({
    tone = 'light',
    compact = false,
    size = 'default',
}: {
    tone?: 'light' | 'dark'
    compact?: boolean
    size?: 'default' | 'mobile'
}) {
    return (
        <span className="inline-flex items-center gap-2.5">
            <img
                src={mark}
                alt=""
                className={size === 'mobile' ? 'h-10 w-auto' : 'h-8 w-auto'}
                draggable={false}
            />
            {!compact && (
                <span
                    className="text-[13px] font-bold leading-[0.95] tracking-[-0.01em] uppercase"
                    style={{ color: tone === 'light' ? '#fffbf5' : '#262626' }}
                >
                    Assembled
                    <br />
                    Brands
                </span>
            )}
        </span>
    )
}
