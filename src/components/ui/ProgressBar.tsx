type Props = {
    value: number
    label?: string
}

/** Sidebar application-progress bar (label + green fill). */
export default function ProgressBar({ value, label = 'Progress' }: Props) {
    const pct = Math.min(100, Math.max(0, value))
    return (
        <div className="flex w-full flex-col gap-[10px]">
            <p className="ab-h5 uppercase text-offwhite">
                {label} {pct}%
            </p>
            <div className="h-[22px] w-full overflow-hidden bg-beige/50">
                <div
                    className="h-full bg-softgreen transition-[width]"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}
