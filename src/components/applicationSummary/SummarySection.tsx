import type { ReactNode } from 'react'

export default function SummarySection({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section className="flex flex-col gap-[20px] border-t border-ink/10 pt-[30px] first:border-t-0 first:pt-0">
            <h3 className="ab-h5 text-ink">{title}</h3>
            <div className="flex flex-col gap-[16px]">{children}</div>
        </section>
    )
}
