import classNames from '@/utils/classNames'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { TbCircleCheck, TbCircleCheckFilled, TbTrash } from 'react-icons/tb'
import type { Ref } from 'react'

type TaskItemProps = {
    taskId: string
    title: string
    description: string
    checked: boolean
    progress: string
    priority: string
    labelClass: Record<string, string>
    onChange: (taskId: string) => void
    ref?: Ref<HTMLTableRowElement>
}

const { Td, Tr } = Table

const TaskItem = (props: TaskItemProps) => {
    const {
        taskId,
        title,
        description,
        checked,
        progress,
        priority,
        labelClass = {},
        onChange,
        ref,
        ...rest
    } = props

    return (
        <Tr ref={ref} {...rest}>
            <Td className="w-[40px]">
                <button
                    className="text-2xl cursor-pointer pt-1"
                    role="button"
                    onClick={() => onChange(taskId)}
                >
                    {checked ? (
                        <TbCircleCheckFilled className="text-primary" />
                    ) : (
                        <TbCircleCheck className="hover:text-primary" />
                    )}
                </button>
            </Td>
            <Td className="w-[500px]">
                <span
                    className={classNames(
                        'heading-text font-bold',
                        checked && 'line-through opacity-50',
                    )}
                >
                    {title}
                </span>
                <p className="text-gray-500 mt-1">{description}</p>
            </Td>
            <Td className="w-[150px]">
                <Tag
                    className={`mr-2 rtl:ml-2 mb-2 ${
                        progress ? labelClass[progress] : ''
                    }`}
                >
                    {progress}
                </Tag>
            </Td>
            <Td className="w-[150px]">
                <Tag
                    className={`mr-2 rtl:ml-2 mb-2 ${
                        priority ? labelClass[priority] : ''
                    }`}
                >
                    {priority}
                </Tag>
            </Td>
            <Td>
                <TbTrash />
            </Td>
        </Tr>
    )
}

export default TaskItem
