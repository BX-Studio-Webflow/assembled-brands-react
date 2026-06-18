import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { cx } from '@/lib/utils'

type Variant = 'auth' | 'soft'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
    error?: boolean
    variant?: Variant
}

function EyeIcon({ off }: { off: boolean }) {
    return (
        <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
            {off && <line x1="3" y1="3" x2="21" y2="21" />}
        </svg>
    )
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
    { type = 'text', error = false, variant = 'auth', className = '', ...rest },
    ref,
) {
    const [reveal, setReveal] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (reveal ? 'text' : 'password') : type

    // Figma uses one input treatment everywhere: off-white fill, square 1px
    // ink border, 15px/22px padding. `variant` is kept for call-site clarity.
    void variant
    const shell = cx(
        'flex w-full items-center border bg-offwhite px-[15px] py-[22px] transition-colors',
        error ? 'border-coral' : 'border-ink',
    )

    return (
        <div className={cx(shell, className)}>
            <input
                {...rest}
                ref={ref}
                type={resolvedType}
                className={cx(
                    'w-full bg-transparent text-[14px] font-medium tracking-[-0.02em] outline-none placeholder:text-ink/70',
                    error ? 'text-coral' : 'text-ink',
                )}
            />
            {isPassword && (
                <button
                    type="button"
                    aria-label={reveal ? 'Hide password' : 'Show password'}
                    className="ml-3 shrink-0 text-ink/60 hover:text-ink"
                    onClick={() => setReveal((v) => !v)}
                >
                    <EyeIcon off={!reveal} />
                </button>
            )}
        </div>
    )
})

export default TextField
