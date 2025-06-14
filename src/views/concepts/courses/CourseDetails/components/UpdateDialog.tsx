import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import sleep from '@/utils/sleep'
import { TbListDetails } from 'react-icons/tb'
import toast from '@/components/ui/toast'
import { apiUpdateModule } from '@/services/CoursesService'
import { AxiosError } from 'axios'
import { Notification } from '@/components/ui/Notification'
import { useNavigate } from 'react-router'

interface UpdateDialogProps {
    isOpen: boolean
    courseId: number
    moduleId: number
    onClose: () => void
    initialTitle?: string
    initialDescription?: string
}

const UpdateDialog = ({
    isOpen,
    courseId,
    moduleId,
    onClose,
    initialTitle = '',
    initialDescription = '',
}: UpdateDialogProps) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)
    const [moduleTitle, setModuleTitle] = useState(initialTitle)
    const [moduleDescription, setModuleDescription] =
        useState(initialDescription)

    useEffect(() => {
        if (isOpen) {
            setModuleTitle(initialTitle)
            setModuleDescription(initialDescription)
        }
    }, [isOpen, initialTitle, initialDescription])

    const handleDialogClose = async () => {
        setPaymentSuccessful(false)
        await sleep(200)
        onClose()
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            if (!moduleTitle) {
                showErrorMessage('Please enter a module title')
                return
            }
            if (!moduleDescription) {
                showErrorMessage('Please enter a module description')
                return
            }
            await apiUpdateModule(Number(courseId), Number(moduleId), {
                title: moduleTitle,
                description: moduleDescription,
                order: 0,
            })
            toast.push(
                <Notification type="success">
                    Module updated successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate(
                `/concepts/courses/course-details/${courseId}?action=updated-module`,
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
            setLoading(false)
            setPaymentSuccessful(true)
        }
    }

    const showErrorMessage = (message: string) => {
        toast.push(<Notification type="danger">{message}</Notification>, {
            placement: 'top-center',
        })
    }

    return (
        <Dialog
            isOpen={isOpen}
            closable={!paymentSuccessful}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <>
                <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="w-full">
                            <span>Module title</span>
                            <div className="flex items-center gap-2 mt-2">
                                <TbListDetails className="text-2xl" />
                                <input
                                    className="focus:outline-hidden heading-text flex-1"
                                    placeholder="Enter module title"
                                    type="text"
                                    value={moduleTitle}
                                    onChange={(e) =>
                                        setModuleTitle(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="w-full">
                            <span>Module description</span>
                            <div className="flex items-center gap-2 mt-2">
                                <TbListDetails className="text-2xl" />
                                <input
                                    className="focus:outline-hidden heading-text flex-1"
                                    placeholder="Enter module description"
                                    type="text"
                                    value={moduleDescription}
                                    onChange={(e) =>
                                        setModuleDescription(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        block
                        variant="solid"
                        loading={loading}
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                </div>
            </>
        </Dialog>
    )
}

export default UpdateDialog
