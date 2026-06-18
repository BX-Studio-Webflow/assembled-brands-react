type Props = {
    step: number
    total: number
}

/** "STEP X OF Y" indicator with a coral progress line (qualification + financial flows). */
export default function StepProgress({ step, total }: Props) {
    const pct = Math.min(100, Math.max(0, (step / total) * 100))
    return (
        <div className="w-full">
            <p className="ab-label text-center text-ink">
                Step {step} of {total}
            </p>
            <div className="relative mt-3 h-px w-full bg-ink/20">
                <div
                    className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-coral transition-[width]"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}
