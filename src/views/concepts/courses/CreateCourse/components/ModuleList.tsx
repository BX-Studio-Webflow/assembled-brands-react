import { useState } from 'react'
import Table from '@/components/ui/Table'
import AddModule from './AddModule'
import type { Module } from '../types'
import ModuleItem from './ModuleItem'

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
    onRemoveModule,
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
                        <ModuleItem
                            key={item.id}
                            moduleId={item.id}
                            title={item.title}
                            description={item.description}
                            onChange={() => onModuleChange(item.id)}
                            onDelete={onRemoveModule}
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
