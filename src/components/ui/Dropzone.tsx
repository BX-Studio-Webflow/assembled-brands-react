import { useRef, useState, type DragEvent } from 'react'
import { LuCloudUpload, LuFile, LuX } from 'react-icons/lu'
import { cx } from '@/lib/utils'

type Props = {
    formats?: string
    accept?: string
    allowedMimeTypes?: readonly string[]
    invalidMessage?: string
    pendingFile: File | null
    uploadedName: string | null
    error?: string | null
    onSelect: (file: File) => void
    onClearPending: () => void
    onDeleteUploaded?: () => void
}

function prettySize(bytes: number) {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
    return `${(kb / 1024).toFixed(1)} MB`
}

export default function Dropzone({
    formats = 'excel',
    accept,
    allowedMimeTypes,
    invalidMessage = 'Invalid file type',
    pendingFile,
    uploadedName,
    error,
    onSelect,
    onClearPending,
    onDeleteUploaded,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    function handleFile(file: File) {
        if (allowedMimeTypes?.length && !allowedMimeTypes.includes(file.type)) {
            setLocalError(invalidMessage)
            return
        }
        setLocalError(null)
        onSelect(file)
    }

    function handleFiles(list: FileList | null) {
        const file = list?.[0]
        if (file) handleFile(file)
    }

    function onDrop(e: DragEvent) {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    const displayName = pendingFile?.name ?? uploadedName
    const displaySize = pendingFile?.size

    return (
        <div className="flex flex-col gap-[10px]">
            <div
                role="button"
                tabIndex={0}
                className={cx(
                    'flex min-h-[140px] flex-col items-center justify-end gap-6 border border-dashed px-3 py-4 text-center transition-colors touch-manipulation md:h-[199px] md:gap-[40px] md:px-[15px] md:py-[22px]',
                    dragging
                        ? 'border-ink bg-beige/60'
                        : 'border-ink bg-offwhite hover:bg-beige/40',
                    (error || localError) && 'border-coral',
                )}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') &&
                    inputRef.current?.click()
                }
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
            >
                <div className="flex flex-col items-center gap-[10px]">
                    <LuCloudUpload aria-hidden className="size-7 text-ink md:size-9" />
                    <p className="ab-label flex flex-wrap items-center justify-center gap-x-[5px] gap-y-1 text-ink">
                        <span className="hidden sm:inline">Drop documents here Or</span>
                        <span className="sm:hidden">Tap to</span>
                        <span className="border-b border-ink">browse</span>
                    </p>
                </div>
                <p className="ab-text-s text-center text-ink">
                    Supported formats: {formats}
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {(error || localError) && (
                <p className="ab-text-s text-coral">{error ?? localError}</p>
            )}

            {displayName && (
                <div className="flex items-center justify-between gap-3 rounded-[4px] border border-ink/15 bg-white px-3 py-2">
                    <span className="flex min-w-0 items-center gap-2">
                        <LuFile className="size-4 shrink-0 text-ink/60" />
                        <span className="ab-text-m truncate text-ink">
                            {displayName}
                        </span>
                        {displaySize != null && (
                            <span className="ab-text-s shrink-0 text-ink/40">
                                {prettySize(displaySize)}
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        aria-label={`Remove ${displayName}`}
                        className="shrink-0 text-ink/50 hover:text-coral"
                        onClick={() => {
                            if (pendingFile) onClearPending()
                            else onDeleteUploaded?.()
                        }}
                    >
                        <LuX className="size-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
