import { useState } from 'react'
import Table from '@/components/ui/Table'
import TaskItem from '@/components/view/TaskItem'
import AddModule from './AddModule'
import { labelClass } from '../utils'
import type { Module } from '../types'

const { TBody } = Table

const ModuleList = () => {
    // Only one list: modules
    const [modules, setModules] = useState<Module[]>([])
    const [isAdding, setIsAdding] = useState(false)

    const handleChange = (taskId: string) => {
        setModules((prev) =>
            prev.map((mod) =>
                mod.id === taskId ? { ...mod, checked: !mod.checked } : mod,
            ),
        )
    }

    const handleCreateModule = (task: Module) => {
        setModules((prev) => [...prev, task])
        setIsAdding(false)
    }

    const handleRemoveModule = (taskId: string) => {
        setModules((prev) => prev.filter((mod) => mod.id !== taskId))
    }

    return (
        <div className="flex flex-col gap-10">
            <Table className="lg:overflow-hidden">
                <TBody>
                    {modules.map((item) => (
                        <tr key={item.id}>
                            <TaskItem
                                ref={null}
                                taskId={item.id}
                                progress={item.progress}
                                checked={item.checked}
                                name={item.name}
                                dueDate={item.dueDate as number}
                                assignee={item.assignee}
                                priority={item.priority}
                                labelClass={labelClass}
                                onChange={() => handleChange(item.id)}
                            />
                            <td>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleRemoveModule(item.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
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
