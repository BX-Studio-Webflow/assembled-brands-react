import type { ReactNode } from 'react'
import ReactModal from 'react-modal'

if (typeof document !== 'undefined') {
    const root = document.getElementById('root')
    if (root) ReactModal.setAppElement(root)
}

type Props = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    contentClassName?: string
}

export default function Modal({
    isOpen,
    onClose,
    children,
    contentClassName = '',
}: Props) {
    return (
        <ReactModal
            isOpen={isOpen}
            closeTimeoutMS={150}
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4"
            className={`outline-none ${contentClassName}`}
            onRequestClose={onClose}
        >
            {children}
        </ReactModal>
    )
}
