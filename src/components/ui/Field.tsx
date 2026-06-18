import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

type Props = {
    label?: ReactNode
    htmlFor?: string
    error?: string
    hint?: ReactNode
    className?: string
    children: ReactNode
}

/** Question/label wrapper used by the application forms. */
export default function Field({
    label,
    htmlFor,
    error,
    hint,
    className,
    children,
}: Props) {
    return (
        <div className={cx('flex flex-col gap-[10px]', className)}>
            {label && (
                <label htmlFor={htmlFor} className="ab-serif">
                    {label}
                </label>
            )}
            {children}
            {hint && !error && <p className="ab-text-s text-ink/50">{hint}</p>}
            {error && <p className="ab-text-s text-coral">{error}</p>}
        </div>
    )
}
