import classNames from '@/utils/classNames'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { TbCircleCheckFilled, TbTrash } from 'react-icons/tb'
import type { Ref } from 'react'
import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { HiClock } from 'react-icons/hi'

type ModuleItemProps = {
    moduleId: string
    title: string
    description: string
    onChange: (moduleId: string) => void
    onDelete: (moduleId: string) => void
    ref?: Ref<HTMLTableRowElement>
}

const { Td, Tr } = Table

const ModuleItem = (props: ModuleItemProps) => {
    const { moduleId, title, description, onChange, onDelete, ref, ...rest } =
        props

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleDeleteConfirm = () => {
        onDelete(moduleId)
        setIsDeleteDialogOpen(false)
    }

    return (
        <>
            <Tr ref={ref} {...rest}>
                <Td className="w-[40px]">
                    <button
                        type="button"
                        className="text-2xl cursor-pointer pt-1"
                        onClick={() => onChange(moduleId)}
                    >
                        <TbCircleCheckFilled className="text-primary" />
                    </button>
                </Td>
                <Td className="w-[500px]">
                    <span className={classNames('heading-text font-bold')}>
                        {title}
                    </span>
                    <p className="text-gray-500 mt-1">{description}</p>
                </Td>
                <Td className="w-[150px]">
                    <div className="mr-2 rtl:ml-2">
                        <Tag
                            prefix={
                                <HiClock className="text-base text-gray-500 mr-1 rtl:ml-1" />
                            }
                        >
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Tag>
                    </div>
                </Td>
                <Td className="w-[150px]">
                    <Tag
                        className={`mr-2 rtl:ml-2 mb-2 text-white bg-indigo-600 border-0`}
                    >
                        New
                    </Tag>
                </Td>
                <Td>
                    <button
                        type="button"
                        className="text-xl cursor-pointer"
                        onClick={handleDeleteClick}
                    >
                        <TbTrash />
                    </button>
                </Td>
            </Tr>
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                type="danger"
                title="Delete Module"
                onClose={handleDeleteClose}
                onRequestClose={handleDeleteClose}
                onCancel={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
            >
                <p>
                    Are you sure you want to delete this module? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ModuleItem
