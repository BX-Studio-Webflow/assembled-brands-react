import type { CSSProperties, ReactNode } from 'react'

/** Beige panel with the brand's chamfered top-left corner. */
export default function BeigeCard({
    children,
    className = '',
    style,
}: {
    children: ReactNode
    className?: string
    style?: CSSProperties
}) {
    return (
        <div
            className={`relative overflow-hidden bg-beige ${className}`}
            style={{
                clipPath:
                    'polygon(96px 0, 100% 0, 100% 100%, 0 100%, 0 72px)',
                ...style,
            }}
        >
            {children}
        </div>
    )
}
