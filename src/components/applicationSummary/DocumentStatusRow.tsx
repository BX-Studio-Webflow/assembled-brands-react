import Badge from '@/components/ui/Badge'
import type { SummaryDocument } from '@/lib/applicationSummary/buildApplicationSummary'

export default function DocumentStatusRow({ document }: { document: SummaryDocument }) {
    const hasFile = Boolean(document.filename)

    return (
        <div className="flex flex-col gap-2 rounded-[4px] border border-ink/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
                <p className="ab-text-s text-ink/60">{document.label}</p>
                <p
                    className={
                        hasFile
                            ? 'ab-serif text-ink'
                            : 'ab-serif text-ink/40'
                    }
                >
                    {hasFile ? document.filename : 'Not Provided'}
                </p>
            </div>
            {hasFile && document.fileType && (
                <Badge tone="active">{document.fileType}</Badge>
            )}
        </div>
    )
}
