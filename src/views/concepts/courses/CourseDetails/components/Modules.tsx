import { useState } from 'react'
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbCircleCheck, TbPencil, TbTrash } from 'react-icons/tb'
import type { CourseWithDetails } from '@/@types/course'
import { useNavigate } from 'react-router'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import { HiPlus } from 'react-icons/hi'
import UpdateDialog from './UpdateDialog'
import toast from '@/components/ui/toast'
import { Notification } from '@/components/ui'
import { AxiosError } from 'axios'
import { mutate } from 'swr'
import { apiDeleteLesson, apiDeleteModule } from '@/services/CoursesService'

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
    const [lessonToDelete, setLessonToDelete] = useState<{
        moduleId: number
        lessonId: number
    } | null>(null)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedModule, setSelectedModule] = useState<{
        courseId: number
        moduleId: number
    } | null>(null)
    const [moduleToDelete, setModuleToDelete] = useState<number | null>(null)

    const handleCheckClick = (moduleId: number, lessonId: number) => {
        setSelectedLesson({ moduleId, lessonId })
    }

    const handleDialogConfirmClick = () => {
        // Here you would typically make an API call to mark the lesson as completed
        setSelectedLesson(null)
    }

    const handleDialogClose = () => {
        setIsUpdateDialogOpen(false)
        setSelectedModule(null)
    }

    const handleDeleteConfirm = async () => {
        if (!lessonToDelete) return
        try {
            await apiDeleteLesson(
                Number(course.course.course.id),
                lessonToDelete.moduleId,
                lessonToDelete.lessonId,
            )
            toast.push(
                <Notification type="success">
                    Lesson deleted successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            mutate('/course')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setLessonToDelete(null)
    }

    const handleDeleteClose = () => {
        setLessonToDelete(null)
    }

    const handleLessonClick = (
        courseId: number,
        moduleId: number,
        lessonId: number,
    ) => {
        navigate(
            `/concepts/courses/article?courseId=${courseId}&moduleId=${moduleId}&lessonId=${lessonId}`,
        )
    }

    const onEdit = (courseId: number, moduleId: number, lessonId: number) => {
        navigate(
            `/concepts/courses/edit-article?courseId=${courseId}&moduleId=${moduleId}&lessonId=${lessonId}`,
        )
    }

    const handleAddLesson = (moduleId: number) => {
        navigate(
            `/concepts/courses/add-article?courseId=${course.course.course.id}&moduleId=${moduleId}`,
        )
    }

    const onDelete = (moduleId: number, lessonId: number) => {
        setLessonToDelete({ moduleId, lessonId })
    }

    const onEditModule = (courseId: number, moduleId: number) => {
        setSelectedModule({ courseId, moduleId })
        setIsUpdateDialogOpen(true)
    }

    const onDeleteModule = (moduleId: number) => {
        setModuleToDelete(moduleId)
    }

    const handleModuleDeleteClose = () => {
        setModuleToDelete(null)
    }

    const handleModuleDeleteConfirm = async () => {
        if (!moduleToDelete) return
        try {
            // Here you would typically make an API call to delete the module
            console.log('Deleting module:', moduleToDelete)
            await apiDeleteModule(
                Number(course.course.course.id),
                Number(moduleToDelete),
            )
            toast.push(
                <Notification type="success">
                    Module deleted successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            mutate('/course')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setModuleToDelete(null)
    }

    return (
        <>
            <Loading loading={!course.course.modules}>
                <div className="flex flex-col gap-12">
                    {course.course.modules?.map((module) => (
                        <div key={module.id}>
                            <div className="flex justify-between items-center gap-2">
                                <h4 className="mb-4 flex items-center gap-2">
                                    {module.title}
                                    <TbPencil
                                        className="text-xl cursor-pointer"
                                        onClick={() =>
                                            onEditModule(
                                                course.course.course.id,
                                                module.id,
                                            )
                                        }
                                    />
                                    <TbTrash
                                        className="text-xl cursor-pointer"
                                        onClick={() =>
                                            onDeleteModule(module.id)
                                        }
                                    />
                                </h4>
                                <Button
                                    className="mr-2"
                                    icon={<HiPlus />}
                                    onClick={() => handleAddLesson(module.id)}
                                >
                                    <span>
                                        <span>Add lesson</span>
                                    </span>
                                </Button>
                            </div>

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

                                            <Td>
                                                <div className="flex items-center gap-3">
                                                    <Tooltip title="Edit">
                                                        <div
                                                            className={`text-xl cursor-pointer select-none font-semibold`}
                                                            role="button"
                                                            onClick={() =>
                                                                onEdit(
                                                                    course
                                                                        .course
                                                                        .course
                                                                        .id,
                                                                    module.id,
                                                                    lesson.id,
                                                                )
                                                            }
                                                        >
                                                            <TbPencil />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <div
                                                            className={`text-xl cursor-pointer select-none font-semibold`}
                                                            role="button"
                                                            onClick={() =>
                                                                onDelete(
                                                                    module.id,
                                                                    lesson.id,
                                                                )
                                                            }
                                                        >
                                                            <TbTrash />
                                                        </div>
                                                    </Tooltip>
                                                </div>
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
            <ConfirmDialog
                isOpen={Boolean(lessonToDelete)}
                type="danger"
                title="Delete Lesson"
                onClose={handleDeleteClose}
                onRequestClose={handleDeleteClose}
                onCancel={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
            >
                <p>
                    Are you sure you want to delete this lesson? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={Boolean(moduleToDelete)}
                type="danger"
                title="Delete Module"
                onClose={handleModuleDeleteClose}
                onRequestClose={handleModuleDeleteClose}
                onCancel={handleModuleDeleteClose}
                onConfirm={handleModuleDeleteConfirm}
            >
                <p>
                    Are you sure you want to delete this module? All lessons
                    within this module will also be deleted. This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
            <UpdateDialog
                isOpen={isUpdateDialogOpen}
                courseId={selectedModule?.courseId || 0}
                moduleId={selectedModule?.moduleId || 0}
                initialTitle={
                    course.course.modules?.find(
                        (m) => m.id === selectedModule?.moduleId,
                    )?.title
                }
                initialDescription={
                    course.course.modules?.find(
                        (m) => m.id === selectedModule?.moduleId,
                    )?.description
                }
                onClose={handleDialogClose}
            />
        </>
    )
}

export default Modules
