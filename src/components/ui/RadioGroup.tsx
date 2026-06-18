import { useId } from 'react'
import { cx } from '@/lib/utils'

export type RadioOption = {
    label: string
    value: string
}

export function radioChipClass(active: boolean) {
    return cx(
        'ab-text-m border border-solid border-ink p-[15px] text-center transition-colors',
        active
            ? 'bg-ink text-offwhite'
            : 'bg-offwhite text-ink hover:bg-ink/5',
    )
}

type Props = {
    name: string
    options: RadioOption[]
    value: string
    onChange: (value: string) => void
    className?: string
    /** Optional id prefix for label association */
    idPrefix?: string
}

/**
 * Figma chip-style radio group (node 3298:4312).
 * Selected: ink fill + offwhite text. Default: offwhite fill + ink border.
 */
export default function RadioGroup({
    name,
    options,
    value,
    onChange,
    className,
    idPrefix,
}: Props) {
    const autoId = useId()
    const groupId = idPrefix ?? autoId

    return (
        <div
            role="radiogroup"
            aria-labelledby={groupId}
            className={cx('gap-[20px]', className ?? 'flex flex-wrap')}
        >
            {options.map((opt) => {
                const active = value === opt.value
                const optionId = `${groupId}-${opt.value}`
                return (
                    <button
                        key={opt.value}
                        id={optionId}
                        type="button"
                        role="radio"
                        name={name}
                        aria-checked={active}
                        className={radioChipClass(active)}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}
