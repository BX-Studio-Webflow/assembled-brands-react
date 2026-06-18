const NOT_PROVIDED = 'Not Provided'

export default function SummaryFieldRow({
    label,
    value,
}: {
    label: string
    value: string | null | undefined
}) {
    const display = value?.trim() ? value : NOT_PROVIDED
    const isMissing = display === NOT_PROVIDED

    return (
        <div className="grid gap-1 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
            <dt className="ab-text-s text-ink/60">{label}</dt>
            <dd
                className={
                    isMissing ? 'ab-serif text-ink/40' : 'ab-serif text-ink'
                }
            >
                {display}
            </dd>
        </div>
    )
}
