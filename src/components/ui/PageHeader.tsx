import type { ReactNode } from 'react'

/** Beige title bar shown at the top of every portal page. */
export default function PageHeader({
    title,
    subtitle,
}: {
    title: string
    subtitle?: ReactNode
}) {
    return (
        <div className="bg-beige p-[24px]">
            <h1 className="ab-h3">{title}</h1>
            {subtitle && <p className="ab-serif mt-2 text-ink/80">{subtitle}</p>}
        </div>
    )
}
