import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Dropzone from '@/components/ui/Dropzone'
import PillButton from '@/components/ui/PillButton'
import ExampleModal from './ExampleModal'

export type UploadSection = {
    id: string
    label: string
    formats?: string
}

type Props = {
    title: string
    sections: UploadSection[]
    nextTo: string
}

export default function DocumentUploadPage({ title, sections, nextTo }: Props) {
    const navigate = useNavigate()
    const [example, setExample] = useState<string | null>(null)

    return (
        <>
            <PageHeader title={title} />
            <PortalCard>
                <div className="mx-auto flex w-full max-w-[543px] flex-col items-end gap-[30px]">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="flex w-full flex-col gap-[10px]"
                        >
                            <div className="flex flex-col items-start gap-[5px]">
                                <p className="ab-serif">{section.label}</p>
                                <button
                                    type="button"
                                    className="ab-text-s border-b border-ink text-ink"
                                    onClick={() => setExample(section.label)}
                                >
                                    See example
                                </button>
                            </div>
                            <Dropzone slot={section.id} formats={section.formats} />
                        </div>
                    ))}

                    <PillButton onClick={() => navigate(nextTo)}>
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
