import type { ReactNode } from 'react'
import { cx } from '@/lib/utils'

type Tone = 'pending' | 'active' | 'neutral'

const tones: Record<Tone, string> = {
    pending: 'bg-lightyellow text-ink',
    active: 'bg-softgreen text-ink',
    neutral: 'bg-ink/10 text-ink',
}

export default function Badge({
    children,
    tone = 'neutral',
}: {
    children: ReactNode
    tone?: Tone
}) {
    return (
        <span
            className={cx(
                'ab-text-s inline-flex items-center rounded-full px-3 py-1',
                tones[tone],
            )}
        >
            {children}
        </span>
    )
}
