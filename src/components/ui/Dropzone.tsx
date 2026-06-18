import { useRef, useState, type DragEvent } from 'react'
import { LuCloudUpload, LuFile, LuX } from 'react-icons/lu'
import {
    useApplicationStore,
    type UploadedFile,
} from '@/store/applicationStore'
import { cx } from '@/lib/utils'

type Props = {
    slot: string
    formats?: string
}

const EMPTY: UploadedFile[] = []

function prettySize(bytes: number) {
    if (!bytes) return ''
    const kb = bytes / 1024
    if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
    return `${(kb / 1024).toFixed(1)} MB`
}

export default function Dropzone({ slot, formats = 'sheets, excel' }: Props) {
    const files = useApplicationStore((s) => s.documents[slot] ?? EMPTY)
    const addDocument = useApplicationStore((s) => s.addDocument)
    const removeDocument = useApplicationStore((s) => s.removeDocument)
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)

    function handleFiles(list: FileList | null) {
        if (!list) return
        Array.from(list).forEach((f) =>
            addDocument(slot, { name: f.name, size: f.size }),
        )
    }

    function onDrop(e: DragEvent) {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    return (
        <div className="flex flex-col gap-[10px]">
            <div
                role="button"
                tabIndex={0}
                className={cx(
                    'flex h-[199px] flex-col items-center justify-end gap-[40px] border border-dashed px-[15px] py-[22px] text-center transition-colors',
                    dragging
                        ? 'border-ink bg-beige/60'
                        : 'border-ink bg-offwhite hover:bg-beige/40',
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
                    <LuCloudUpload aria-hidden className="size-9 text-ink" />
                    <p className="ab-label flex items-center gap-[5px] text-ink">
                        Drop documents here Or
                        <span className="border-b border-ink">browse</span>
                    </p>
                </div>
                <p className="ab-text-s text-center text-ink">
                    Supported formats: {formats}
                </p>
                <input
                    ref={inputRef}
                    multiple
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {files.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {files.map((f) => (
                        <li
                            key={f.name}
                            className="flex items-center justify-between gap-3 rounded-[4px] border border-ink/15 bg-white px-3 py-2"
                        >
                            <span className="flex min-w-0 items-center gap-2">
                                <LuFile className="size-4 shrink-0 text-ink/60" />
                                <span className="ab-text-m truncate text-ink">
                                    {f.name}
                                </span>
                                <span className="ab-text-s shrink-0 text-ink/40">
                                    {prettySize(f.size)}
                                </span>
                            </span>
                            <button
                                type="button"
                                aria-label={`Remove ${f.name}`}
                                className="shrink-0 text-ink/50 hover:text-coral"
                                onClick={() => removeDocument(slot, f.name)}
                            >
                                <LuX className="size-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
