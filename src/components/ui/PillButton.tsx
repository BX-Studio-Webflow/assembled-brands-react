import type { ButtonHTMLAttributes } from 'react'
import { cx } from '@/lib/utils'

type Variant = 'stack' | 'solid' | 'outline' | 'muted'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    loading?: boolean
    fullWidth?: boolean
}

/**
 * Assembled Brands pill button.
 *  - stack:   outlined face with a hard offset ink shadow (auth CTAs)
 *  - solid:   filled ink (Cancel / Back)
 *  - outline: ink border, transparent face (Next / Save & Continue)
 *  - muted:   disabled-looking stacked button
 */
export default function PillButton({
    children,
    variant = 'stack',
    loading = false,
    fullWidth = false,
    disabled,
    className = '',
    ...rest
}: Props) {
    const isDisabled = disabled || loading
    const label = loading ? 'Please wait…' : children

    if (variant === 'solid') {
        return (
            <button
                {...rest}
                disabled={isDisabled}
                className={cx(
                    'ab-label inline-flex items-center justify-center rounded-full border border-ink bg-ink px-6 py-3 text-offwhite transition-opacity hover:opacity-90',
                    fullWidth && 'w-full',
                    isDisabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                {label}
            </button>
        )
    }

    if (variant === 'outline') {
        return (
            <button
                {...rest}
                disabled={isDisabled}
                className={cx(
                    'ab-label inline-flex items-center justify-center rounded-full border border-ink bg-offwhite px-6 py-3 text-ink transition-colors hover:bg-ink hover:text-offwhite',
                    fullWidth && 'w-full',
                    isDisabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                {label}
            </button>
        )
    }

    // stack & muted share the offset-shadow construction
    const muted = variant === 'muted'
    return (
        <span
            className={cx(
                'relative',
                fullWidth ? 'flex w-full' : 'inline-flex w-fit',
            )}
        >
            <span
                aria-hidden
                className={cx(
                    'pointer-events-none absolute inset-0 translate-x-[2px] translate-y-[3px] rounded-full',
                    muted ? 'bg-ink/50' : 'bg-ink',
                )}
            />
            <button
                {...rest}
                disabled={isDisabled}
                className={cx(
                    'ab-label relative inline-flex items-center justify-center rounded-full border bg-offwhite px-6 py-3 transition-colors',
                    fullWidth && 'w-full',
                    muted
                        ? 'cursor-not-allowed border-ink/50 text-ink/50'
                        : 'border-ink text-ink hover:bg-ink hover:text-offwhite',
                    isDisabled && !muted && 'cursor-not-allowed opacity-70',
                    className,
                )}
            >
                {label}
            </button>
        </span>
    )
}
