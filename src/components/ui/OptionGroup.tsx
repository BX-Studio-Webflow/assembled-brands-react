import { cx } from '@/lib/utils'

type Props = {
    options: string[]
    value: string
    onChange: (value: string) => void
    /** Render as a single selectable row that wraps. */
    className?: string
}

/**
 * Segmented choice control — the bordered "pill" buttons used throughout the
 * qualification flow (e.g. company size, asset type). Selected = solid ink.
 */
export default function OptionGroup({
    options,
    value,
    onChange,
    className,
}: Props) {
    return (
        <div className={cx('flex flex-wrap gap-[20px]', className)}>
            {options.map((opt) => {
                const active = value === opt
                return (
                    <button
                        key={opt}
                        type="button"
                        aria-pressed={active}
                        className={cx(
                            'ab-text-m border p-[15px] transition-colors',
                            active
                                ? 'border-ink bg-ink text-offwhite'
                                : 'border-ink bg-offwhite text-ink hover:bg-ink/5',
                        )}
                        onClick={() => onChange(opt)}
                    >
                        {opt}
                    </button>
                )
            })}
        </div>
    )
}
