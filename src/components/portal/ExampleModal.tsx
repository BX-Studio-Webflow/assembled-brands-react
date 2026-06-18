import { LuFileSpreadsheet } from 'react-icons/lu'
import Modal from '@/components/ui/Modal'
import PillButton from '@/components/ui/PillButton'

type Props = {
    open: boolean
    title: string
    onClose: () => void
}

/** "See example" lightbox — shows a sample document for an upload slot. */
export default function ExampleModal({ open, title, onClose }: Props) {
    return (
        <Modal isOpen={open} contentClassName="w-full max-w-[860px]" onClose={onClose}>
            <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="ab-h3 max-w-[640px] !text-offwhite">{title}</h2>
                <PillButton
                    variant="solid"
                    className="!border-offwhite !bg-offwhite !text-ink"
                    onClick={onClose}
                >
                    Close
                </PillButton>
                <div className="flex w-full items-center justify-center rounded-[4px] bg-white p-6">
                    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-[2px] border border-ink/10 bg-gray-50 text-ink/40">
                        <LuFileSpreadsheet className="size-12" />
                        <span className="ab-text-m">Sample document preview</span>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
