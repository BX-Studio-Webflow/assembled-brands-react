import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cx } from '@/lib/utils'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
    { error, className = '', rows = 3, ...rest },
    ref,
) {
    return (
        <textarea
            {...rest}
            ref={ref}
            rows={rows}
            className={cx(
                'w-full border bg-offwhite px-[15px] py-[22px] text-[14px] font-medium tracking-[-0.02em] text-ink outline-none transition-colors placeholder:text-ink/70',
                error ? 'border-coral' : 'border-ink',
                className,
            )}
        />
    )
})

export default Textarea
