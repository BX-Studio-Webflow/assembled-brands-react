'use client'

// React Imports
import { useState } from 'react'

// Type Imports
import Card from '@/components/ui/Card/Card'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import type { CourseWithDetails } from '@/@types/course'
import { FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import Tooltip from '@/components/ui/Tooltip'

const Sidebar = ({ data }: { data: CourseWithDetails | undefined }) => {
    const modules = Array.isArray(data?.modules) ? data.modules : []
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(0)

    const handleAccordion = (idx: number) => {
        setExpanded(expanded === idx ? -1 : idx)
    }

    const handleLessonClick = (moduleId: number, lessonId: number) => {
        navigate(
            `/concepts/courses/article?courseId=${data?.course?.id}&moduleId=${moduleId}&lessonId=${lessonId}`,
        )
    }

    return (
        <Card
            className="w-full max-w-md bg-gray-50 border border-gray-200 p-0"
            bodyClass="p-0"
        >
            <div className="p-4 border-b border-gray-200">
                <div>
                    <div className="font-semibold text-gray-700 text-lg mb-1">
                        Course Content
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                        2 / 5 | 273 min
                    </div>
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
                                className="w-full text-left border-b border-gray-100 bg-gray-50 hover:bg-gray-100 focus:outline-none px-4 py-3"
                                onClick={() => handleAccordion(idx)}
                                type="button"
                            >
                                <div className="flex justify-between items-center">
                                    <Tooltip title={mod.description}>
                                        {' '}
                                        <span
                                            className={
                                                expanded === idx
                                                    ? 'font-bold cursor-pointer'
                                                    : 'cursor-pointer'
                                            }
                                        >
                                            {mod.title}
                                        </span>
                                    </Tooltip>
                                    <span
                                        className={`text-gray-400 text-lg transition-transform duration-200 ${expanded === idx ? 'rotate-90' : ''}`}
                                    >
                                        <FaChevronRight />
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {`${completed} / ${(mod.lessons || []).length} | ${totalTime ? totalTime.toFixed(2) : 'N/A'} min`}
                                </div>
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
                                                <span
                                                    className="font-medium text-gray-900 text-sm cursor-pointer"
                                                    onClick={() =>
                                                        handleLessonClick(
                                                            mod.id,
                                                            lesson.id,
                                                        )
                                                    }
                                                >{`${tIdx + 1}. ${lesson.title}`}</span>
                                                <span className="block text-xs text-gray-500">
                                                    {lesson.lesson_duration ||
                                                        0}{' '}
                                                    min
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
