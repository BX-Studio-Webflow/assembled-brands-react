'use client'

// React Imports
import { useState } from 'react'

// Type Imports
import Card from '@/components/ui/Card/Card'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import type { CourseWithDetails } from '@/@types/course'

const Sidebar = ({ data }: { data: CourseWithDetails | undefined }) => {
    const modules = Array.isArray(data?.modules) ? data.modules : []
    const [expanded, setExpanded] = useState(0)

    const handleAccordion = (idx: number) => {
        setExpanded(expanded === idx ? -1 : idx)
    }

    return (
        <Card className="w-full max-w-md bg-gray-50 border border-gray-200 p-0">
            <div className="p-4 border-b border-gray-200">
                <div className="font-semibold text-gray-700 text-lg mb-1">
                    Course Content
                </div>
                <div className="text-xs text-gray-500 mb-2">
                    2 / 5 | 273 min
                </div>
            </div>
            <div>
                {modules.map((mod, idx) => {
                    const totalTime = (mod.lessons || []).reduce(
                        (sum, lesson) =>
                            sum +
                            (typeof lesson.lesson_duration === 'number'
                                ? lesson.lesson_duration
                                : 0),
                        0,
                    )
                    const completed = (mod.lessons || []).filter(
                        (lesson) => lesson.is_completed,
                    ).length
                    return (
                        <div key={mod.id}>
                            <button
                                className={`w-full flex justify-between items-center px-4 py-3 text-left border-b border-gray-100 bg-gray-50 hover:bg-gray-100 focus:outline-none ${expanded === idx ? 'font-bold' : ''}`}
                                onClick={() => handleAccordion(idx)}
                                type="button"
                            >
                                <span>{mod.title}</span>
                                <span className="text-xs text-gray-500">{`${completed} / ${(mod.lessons || []).length} | ${totalTime ? totalTime.toFixed(2) : 'N/A'} min`}</span>
                            </button>
                            <div
                                className={`transition-all duration-200 ${expanded === idx ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}
                            >
                                <ul className="flex flex-col gap-2 px-6 py-3 bg-white">
                                    {(mod.lessons || []).map((lesson, tIdx) => (
                                        <li
                                            key={lesson.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Checkbox
                                                checked={!!lesson.is_completed}
                                                // onChange handler can be added here if you want to update completion
                                            />
                                            <div>
                                                <span className="font-medium text-gray-900 text-sm">{`${tIdx + 1}. ${lesson.title}`}</span>
                                                <span className="block text-xs text-gray-500">
                                                    {typeof lesson.lesson_duration ===
                                                    'number'
                                                        ? `${lesson.lesson_duration} min`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default Sidebar
