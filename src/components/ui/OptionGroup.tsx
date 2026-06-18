import RadioGroup from '@/components/ui/RadioGroup'
import { cx } from '@/lib/utils'

type Props = {
    options: string[]
    value: string
    onChange: (value: string) => void
    name?: string
    className?: string
}

/**
 * Segmented choice control — Figma node 3298:4312 (company type, employees, etc.).
 * Wraps {@link RadioGroup} with string options where label === value.
 */
export default function OptionGroup({
    options,
    value,
    onChange,
    name = 'option-group',
    className,
}: Props) {
    return (
        <RadioGroup
            name={name}
            value={value}
            className={cx(className)}
            options={options.map((opt) => ({ label: opt, value: opt }))}
            onChange={onChange}
        />
    )
}
