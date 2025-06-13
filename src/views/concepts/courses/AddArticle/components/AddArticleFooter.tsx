import { useState } from 'react'
import { Button, toast, Notification } from '@/components/ui'
import { apiCreateLesson } from '@/services/CoursesService'
import { TbDeviceFloppy, TbArrowNarrowLeft } from 'react-icons/tb'
import sleep from '@/utils/sleep'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'

interface AddArticleFooterProps {
    courseId: string | null
    moduleId: string | null
    title: string
    content: string
    videoAssetId: number
}

const AddArticleFooter = ({
    courseId,
    moduleId,
    title,
    content,
    videoAssetId,
}: AddArticleFooterProps) => {
    const [isPublishing, setIsPublishing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate()
    const handleBack = () => {
        window.history.back()
    }

    const handleSave = async () => {
        setIsSaving(true)
        await sleep(1000)
        toast.push(<Notification type="success">Saved as draft</Notification>, {
            placement: 'top-center',
        })
        setIsSaving(false)
    }

    const handlePublish = async () => {
        if (!courseId || !moduleId) return

        setIsPublishing(true)
        try {
            if (!videoAssetId) {
                showErrorMessage(
                    'Please add a video to your lesson so learners have something to watch and learn from.',
                )
                return
            }
            if (!title) {
                showErrorMessage(
                    'Please add a title for your lesson to let learners know what it’s about.',
                )
                return
            }
            if (!content) {
                showErrorMessage(
                    'Please add some content to give more context and value to your lesson.',
                )
                return
            }

            await apiCreateLesson(Number(courseId), Number(moduleId), {
                title: title || 'Untitled article',
                content: content,
                description: '', // Empty description for now
                video_asset_id: videoAssetId,
                duration: 10, // Duration will be calculated based on content
                order: 0, // Will be set by the backend
            })
            toast.push(
                <Notification type="success">
                    Article published successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate(
                `/concepts/courses/course-details/${courseId}?action=added-lesson`,
            )
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            setIsPublishing(false)
        }
    }
    const showErrorMessage = (error: string) => {
        toast.push(<Notification type="danger">{error}</Notification>, {
            placement: 'top-center',
        })
    }

    return (
        <div className="sticky bottom-0 left-0 right-0 z-10 mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 -mx-4 sm:-mx-8 py-4">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between px-8">
                    <Button
                        className="ltr:mr-3 rtl:ml-3"
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <div className="flex items-center">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            icon={<TbDeviceFloppy />}
                            loading={isSaving}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                        <Button
                            variant="solid"
                            type="button"
                            loading={isPublishing}
                            onClick={handlePublish}
                        >
                            Publish
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddArticleFooter
