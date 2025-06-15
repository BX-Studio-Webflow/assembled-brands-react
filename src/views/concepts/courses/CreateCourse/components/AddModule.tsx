import { useEffect, useState, useRef } from 'react'
import classNames from '@/utils/classNames'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import { TbPlus, TbCircleCheck } from 'react-icons/tb'
import uniqueId from 'lodash/uniqueId'
import type { Module } from '../types'

type AddTaskProps = {
    groupKey: string
    isCreatingTask: boolean
    onAddTaskClick: (key: string) => void
    onCreateTask: (task: Module) => void
}

const { TBody, Tr, Td } = Table

const AddModule = ({
    groupKey,
    isCreatingTask,
    onAddTaskClick,
    onCreateTask,
}: AddTaskProps) => {
    const nameRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        if (isCreatingTask) {
            nameRef.current?.focus()
        }
    }, [isCreatingTask])

    const handleCreateClick = () => {
        const task: Module = {
            id: uniqueId('task_'),
            title: nameRef.current?.value || 'Untitled module',
            description: descriptionRef.current?.value || '',
        }

        onCreateTask(task)
        if (nameRef.current) nameRef.current.value = ''
        if (descriptionRef.current) descriptionRef.current.value = ''
    }

    return (
        <>
            {isCreatingTask ? (
                <div
                    className={classNames(
                        'rounded-lg transition-shadow duration-150',
                        focused && 'shadow-xl',
                    )}
                >
                    <Table hoverable={false} overflow={false}>
                        <TBody>
                            <Tr>
                                <Td className="w-[40px] text-2xl">
                                    <TbCircleCheck />
                                </Td>
                                <Td className="w-[500px]">
                                    <input
                                        ref={nameRef}
                                        className="outline-0 font-semibold w-full heading-text bg-transparent"
                                        placeholder="Enter module name"
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                    />
                                </Td>
                                <Td className="w-[500px]">
                                    <input
                                        ref={descriptionRef}
                                        className="outline-0 font-semibold w-full heading-text bg-transparent"
                                        placeholder="Enter module description"
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                    />
                                </Td>
                                <Td className="py-1">
                                    <div className="flex items-center justify-end">
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={handleCreateClick}
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </Td>
                            </Tr>
                        </TBody>
                    </Table>
                </div>
            ) : (
                <Button
                    block
                    type="button"
                    icon={<TbPlus />}
                    customColorClass={() =>
                        'border-dashed border-2 hover:ring-transparent bg-gray-50'
                    }
                    onClick={() => onAddTaskClick(groupKey)}
                >
                    Add module
                </Button>
            )}
        </>
    )
}

export default AddModule
