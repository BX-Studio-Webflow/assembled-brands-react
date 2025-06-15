import classNames from '@/utils/classNames'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import { TbCircleCheckFilled, TbTrash } from 'react-icons/tb'
import type { Ref } from 'react'

type TaskItemProps = {
    taskId: string
    title: string
    description: string
    onChange: (taskId: string) => void
    ref?: Ref<HTMLTableRowElement>
}

const { Td, Tr } = Table

const TaskItem = (props: TaskItemProps) => {
    const {
        taskId,
        title,
        description,

        onChange,
        ref,
        ...rest
    } = props

    return (
        <Tr ref={ref} {...rest}>
            <Td className="w-[40px]">
                <button
                    type="button"
                    className="text-2xl cursor-pointer pt-1"
                    onClick={() => onChange(taskId)}
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
                <Tag className={`mr-2 rtl:ml-2 mb-2`}>New</Tag>
            </Td>
            <Td className="w-[150px]">
                <Tag className={`mr-2 rtl:ml-2 mb-2`}>New</Tag>
            </Td>
            <Td>
                <TbTrash />
            </Td>
        </Tr>
    )
}

export default TaskItem
