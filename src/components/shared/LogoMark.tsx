import logoMark from '@/assets-ab/AssembledBrands_Logo_Transparent 2 Logo Collapsed.svg'
import wordmark from '@/assets-ab/Asembled Word SVG.svg'
import { cx } from '@/lib/utils'

/** Sidebar / header logo lockup from Figma.
 *  Expanded: hex mark + wordmark. Collapsed: mark only. */
export default function LogoMark({
    tone = 'light',
    compact = false,
    size = 'default',
}: {
    tone?: 'light' | 'dark'
    compact?: boolean
    size?: 'default' | 'mobile'
}) {
    const markClassName =
        size === 'mobile' ? 'h-10 w-auto' : 'h-[37px] w-auto'

    if (compact) {
        return (
            <img
                src={logoMark}
                alt="Assembled Brands"
                className={markClassName}
                draggable={false}
            />
        )
    }

    return (
        <span
            className={cx(
                'inline-flex items-center',
                size === 'mobile' ? 'gap-[30px]' : 'gap-[5px]',
            )}
        >
            <img
                src={logoMark}
                alt=""
                aria-hidden
                className={markClassName}
                draggable={false}
            />
            <img
                src={wordmark}
                alt="Assembled Brands"
                className={cx(
                    size === 'mobile' ? 'h-[36px] w-auto' : 'h-8 w-auto',
                    tone === 'dark' && 'brightness-0',
                )}
                draggable={false}
            />
        </span>
    )
}
