import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Dropzone from '@/components/ui/Dropzone'
import PillButton from '@/components/ui/PillButton'
import DocumentUploadSkeleton from '@/components/skeletons/DocumentUploadSkeleton'
import ExampleModal from './ExampleModal'
import {
    getDocumentsForPage,
    type DocumentUploadPageConfig,
    type DocumentUploadSectionConfig,
} from '@/configs/documentUpload'
import { isExternalNavUrl } from '@/configs/navigation'
import { uploadFinancialDocumentFile } from '@/lib/api/uploadFinancialDocumentFile'
import { fetchFinancialProgress } from '@/lib/api/financialProgress'
import { useFinancialProgress } from '@/lib/hooks/useFinancialProgress'
import { revalidateAfterFinancialSave, revalidateSidebarProgress } from '@/lib/swr/mutate'
import { apiDeleteFinancialDocument } from '@/services/FinancialWizardService'
import type { FinancialDocument } from '@/types/financial-wizard'

type SectionState = {
    pendingFile: File | null
    uploadedDoc: FinancialDocument | null
    error: string | null
}

const emptySectionState = (): SectionState => ({
    pendingFile: null,
    uploadedDoc: null,
    error: null,
})

export type DocumentUploadPageProps = DocumentUploadPageConfig & {
    headerContent?: ReactNode
    renderAfterSection?: (sectionId: string) => ReactNode
    validateSubmit?: () => string | null
    onBeforeSubmit?: () => Promise<void>
    onAfterSubmit?: () => Promise<void>
    isSectionRequired?: (section: DocumentUploadSectionConfig) => boolean
    onProgressLoaded?: (
        progress: NonNullable<ReturnType<typeof useFinancialProgress>['data']>,
    ) => void
}

export default function DocumentUploadPage({
    title,
    page,
    sections,
    nextTo,
    requireAll = true,
    headerContent,
    renderAfterSection,
    validateSubmit,
    onBeforeSubmit,
    onAfterSubmit,
    isSectionRequired,
    onProgressLoaded,
}: DocumentUploadPageProps) {
    const navigate = useNavigate()
    const { data: progress, isLoading, mutate } = useFinancialProgress()
    const [example, setExample] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [sectionState, setSectionState] = useState<Record<string, SectionState>>(
        () =>
            Object.fromEntries(
                sections.map((s) => [
                    s.id,
                    { pendingFile: null, uploadedDoc: null, error: null },
                ]),
            ),
    )

    const sectionIsRequired = useCallback(
        (section: DocumentUploadSectionConfig) =>
            isSectionRequired ? isSectionRequired(section) : requireAll,
        [isSectionRequired, requireAll],
    )

    useEffect(() => {
        if (!progress) return
        onProgressLoaded?.(progress)
    }, [onProgressLoaded, progress])

    useEffect(() => {
        if (!progress) return
        const docs = getDocumentsForPage(progress, page)
        setSectionState((prev) =>
            Object.fromEntries(
                sections.map((section) => {
                    const uploadedDoc =
                        docs.find(
                            (d) => d.document_type === section.documentType,
                        ) ?? null
                    const existing = prev[section.id]
                    return [
                        section.id,
                        {
                            pendingFile: existing?.pendingFile ?? null,
                            uploadedDoc:
                                existing?.uploadedDoc ?? uploadedDoc,
                            error: existing?.error ?? null,
                        },
                    ]
                }),
            ),
        )
    }, [page, progress, sections])

    function getSectionState(id: string): SectionState {
        return sectionState[id] ?? emptySectionState()
    }

    function patchSection(id: string, patch: Partial<SectionState>) {
        setSectionState((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? emptySectionState()), ...patch },
        }))
    }

    async function handleDeleteUploaded(sectionId: string, docId: number) {
        patchSection(sectionId, { error: null })
        try {
            await apiDeleteFinancialDocument(docId)
            patchSection(sectionId, { uploadedDoc: null })
            await mutate(fetchFinancialProgress(), { revalidate: false })
            void revalidateSidebarProgress()
        } catch (err) {
            patchSection(sectionId, {
                error:
                    (err as { message?: string }).message ??
                    'Failed to delete file',
            })
        }
    }

    async function onSubmit() {
        setFormError(null)

        const extraError = validateSubmit?.()
        if (extraError) {
            setFormError(extraError)
            return
        }

        const missingRequired = sections.filter((section) => {
            if (!sectionIsRequired(section)) return false
            const state = getSectionState(section.id)
            return !state.pendingFile && !state.uploadedDoc
        })

        if (missingRequired.length > 0) {
            setFormError('Please upload all required documents')
            return
        }

        const uploads = sections
            .map((section) => ({
                section,
                file: getSectionState(section.id).pendingFile,
            }))
            .filter(
                (
                    entry,
                ): entry is {
                    section: DocumentUploadSectionConfig
                    file: File
                } => Boolean(entry.file),
            )

        setSubmitting(true)
        try {
            if (onBeforeSubmit) {
                await onBeforeSubmit()
            }

            if (uploads.length > 0) {
                await Promise.all(
                    uploads.map(({ section, file }) =>
                        uploadFinancialDocumentFile(
                            file,
                            page,
                            section.documentType,
                            section.allowedMimeTypes,
                        ),
                    ),
                )
            }

            await revalidateAfterFinancialSave()
            if (onAfterSubmit) {
                await onAfterSubmit()
            }
            if (isExternalNavUrl(nextTo)) {
                window.location.assign(nextTo)
                return
            }
            navigate(nextTo)
        } catch (err) {
            setFormError(
                (err as { message?: string }).message ??
                    'There was a problem saving your information',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <DocumentUploadSkeleton
                title={title}
                sections={sections.length}
                showHeaderFields={Boolean(headerContent)}
            />
        )
    }

    return (
        <>
            <PageHeader title={title} />
            <PortalCard>
                <div className="mx-auto flex w-full max-w-[543px] flex-col items-end gap-[30px]">
                    {headerContent}

                    {sections.map((section) => {
                        const state = getSectionState(section.id)
                        const exampleText =
                            section.exampleLabel ??
                            (section.label ? 'See example' : null)
                        const showExample =
                            exampleText != null &&
                            (section.exampleUrl !== undefined
                                ? Boolean(section.exampleUrl)
                                : section.exampleLabel !== null &&
                                  (section.exampleLabel !== undefined ||
                                      section.label !== undefined))
                        const useExternalExample = Boolean(section.exampleUrl)

                        return (
                            <div key={section.id} className="contents">
                                <div className="flex w-full flex-col gap-[10px]">
                                    <div className="flex flex-col items-start gap-[5px]">
                                        {section.title ? (
                                            <>
                                                <p className="ab-h5 text-ink">
                                                    {section.title}
                                                </p>
                                                {section.description && (
                                                    <p className="ab-serif text-ink">
                                                        {section.description}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            section.label && (
                                                <p className="ab-serif">
                                                    {section.label}
                                                </p>
                                            )
                                        )}
                                        {showExample && exampleText && useExternalExample && (
                                            <a
                                                href={section.exampleUrl!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ab-text-s border-b border-ink text-ink"
                                            >
                                                {exampleText}
                                            </a>
                                        )}
                                        {showExample &&
                                            exampleText &&
                                            !useExternalExample && (
                                                <button
                                                    type="button"
                                                    className="ab-text-s border-b border-ink text-ink"
                                                    onClick={() =>
                                                        setExample(
                                                            section.title ??
                                                                section.label ??
                                                                exampleText,
                                                        )
                                                    }
                                                >
                                                    {exampleText}
                                                </button>
                                            )}
                                    </div>
                                    <Dropzone
                                        formats={section.formats}
                                        accept={section.accept}
                                        allowedMimeTypes={
                                            section.allowedMimeTypes
                                        }
                                        invalidMessage={section.invalidMessage}
                                        pendingFile={state.pendingFile}
                                        uploadedName={
                                            state.uploadedDoc?.asset_name ??
                                            null
                                        }
                                        error={state.error}
                                        onSelect={(file) =>
                                            patchSection(section.id, {
                                                pendingFile: file,
                                                error: null,
                                            })
                                        }
                                        onClearPending={() =>
                                            patchSection(section.id, {
                                                pendingFile: null,
                                            })
                                        }
                                        onDeleteUploaded={
                                            state.uploadedDoc
                                                ? () =>
                                                      void handleDeleteUploaded(
                                                          section.id,
                                                          state.uploadedDoc!.id,
                                                      )
                                                : undefined
                                        }
                                    />
                                </div>
                                {renderAfterSection?.(section.id)}
                            </div>
                        )
                    })}

                    {formError && (
                        <p className="ab-text-m w-full text-coral">{formError}</p>
                    )}

                    <PillButton loading={submitting} onClick={() => void onSubmit()}>
                        Save & Continue
                    </PillButton>
                </div>
            </PortalCard>

            <ExampleModal
                open={example !== null}
                title={example ?? ''}
                onClose={() => setExample(null)}
            />
        </>
    )
}
