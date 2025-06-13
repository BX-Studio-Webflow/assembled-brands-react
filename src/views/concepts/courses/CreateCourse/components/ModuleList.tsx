import { useState } from 'react'
import Table from '@/components/ui/Table'
import AddModule from './AddModule'
import { labelClass } from '../utils'
import type { Module } from '../types'
import TaskItem from './TaskItem'

const { TBody } = Table

interface ModuleListProps {
    modules: Module[]
    onModuleChange: (taskId: string) => void
    onCreateModule: (task: Module) => void
    onRemoveModule: (taskId: string) => void
}

const ModuleList = ({
    modules,
    onModuleChange,
    onCreateModule,
}: ModuleListProps) => {
    const [isAdding, setIsAdding] = useState(false)

    const handleCreateModule = (task: Module) => {
        onCreateModule(task)
        setIsAdding(false)
    }

    return (
        <div className="flex flex-col gap-10 mb-4">
            <Table className="lg:overflow-hidden">
                <TBody>
                    {modules?.map((item) => (
                        <TaskItem
                            key={item.id}
                            ref={null}
                            taskId={item.id}
                            progress={item.progress}
                            checked={item.checked}
                            name={item.name}
                            dueDate={item.dueDate as number}
                            assignee={item.assignee}
                            priority={item.priority}
                            labelClass={labelClass}
                            onChange={() => onModuleChange(item.id)}
                        />
                    ))}
                </TBody>
            </Table>
            <div className="mt-4">
                <AddModule
                    isCreatingTask={isAdding}
                    groupKey={''}
                    onAddTaskClick={() => setIsAdding(true)}
                    onCreateTask={handleCreateModule}
                />
            </div>
        </div>
    )
}

export default ModuleList
