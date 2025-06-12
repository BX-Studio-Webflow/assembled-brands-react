import { useState } from 'react'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbCircleCheck } from 'react-icons/tb'
import type { CourseWithDetails } from '@/@types/course'
import { useNavigate } from 'react-router'

const { Td, Tr, TBody } = Table

interface ModulesProps {
    course: CourseWithDetails
}

const Modules = (course: ModulesProps) => {
    const navigate = useNavigate()
    const [selectedLesson, setSelectedLesson] = useState<{
        moduleId: number
        lessonId: number
    } | null>(null)

    const handleCheckClick = (moduleId: number, lessonId: number) => {
        setSelectedLesson({ moduleId, lessonId })
    }

    const handleDialogConfirmClick = () => {
        // Here you would typically make an API call to mark the lesson as completed
        setSelectedLesson(null)
    }

    const handleDialogClose = () => {
        setSelectedLesson(null)
    }

    console.log(course.course.modules)

    const handleLessonClick = (
        courseId: number,
        moduleId: number,
        lessonId: number,
    ) => {
        navigate(
            `/concepts/courses/article?courseId=${courseId}&moduleId=${moduleId}&lessonId=${lessonId}`,
        )
    }

    return (
        <>
            <Loading loading={!course.course.modules}>
                <div className="flex flex-col gap-12">
                    {course.course.modules?.map((module) => (
                        <div key={module.id}>
                            <h4 className="mb-4">{module.title}</h4>
                            <p className="mb-4 text-gray-500">
                                {module.description}
                            </p>
                            <Table compact hoverable={false}>
                                <TBody>
                                    {module.lessons.map((lesson) => (
                                        <Tr key={lesson.id}>
                                            <Td className="w-[40px]">
                                                <button
                                                    className="text-2xl cursor-pointer pt-1"
                                                    role="button"
                                                    onClick={() =>
                                                        handleCheckClick(
                                                            module.id,
                                                            lesson.id,
                                                        )
                                                    }
                                                >
                                                    <TbCircleCheck className="hover:text-primary" />
                                                </button>
                                            </Td>
                                            <Td
                                                className="w-[500px]"
                                                onClick={() => {
                                                    handleLessonClick(
                                                        course.course.course.id,
                                                        module.id,
                                                        lesson.id,
                                                    )
                                                }}
                                            >
                                                <span className="heading-text font-bold">
                                                    {lesson.title}
                                                </span>
                                            </Td>
                                            <Td className="w-[200px]">
                                                <Tag className="mr-2 rtl:ml-2 mb-2 bg-blue-100 dark:bg-blue-100 dark:text-gray-900">
                                                    {lesson.lesson_duration}{' '}
                                                    minutes
                                                </Tag>
                                            </Td>
                                            <Td className="w-[150px]">
                                                <span className="font-semibold">
                                                    {lesson.created_at || '-'}
                                                </span>
                                            </Td>
                                            <Td className="w-[150px]">
                                                <span className="font-semibold">
                                                    {lesson.updated_at || '-'}
                                                </span>
                                            </Td>
                                            <Td>
                                                {lesson.video ? (
                                                    <span className="text-green-500">
                                                        Video Available
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        No Video
                                                    </span>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </TBody>
                            </Table>
                        </div>
                    ))}
                </div>
            </Loading>
            <ConfirmDialog
                isOpen={Boolean(selectedLesson)}
                type="info"
                title="Mark lesson as completed"
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                onCancel={handleDialogClose}
                onConfirm={handleDialogConfirmClick}
            >
                <p>Are you sure you want to mark this lesson as completed?</p>
            </ConfirmDialog>
        </>
    )
}

export default Modules
