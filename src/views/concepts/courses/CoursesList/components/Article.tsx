import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { categoryIcon } from '../utils'
import classNames from '@/utils/classNames'
import { useNavigate } from 'react-router'
import { TbEdit, TbTrash } from 'react-icons/tb'
import { ConfirmDialog } from '@/components/shared'
import { useState } from 'react'
import toast from '@/components/ui/toast'
import { apiDeleteCourse } from '@/services/CoursesService'
import { Notification } from '@/components/ui'
import { AxiosError } from 'axios'
import { mutate } from 'swr'

type ArticleProps = {
    id: string
    isLastChild: boolean
    category: string
    title: string
    timeToRead: number
}

const Article = ({
    id,
    isLastChild,
    category,
    title,
    timeToRead,
}: ArticleProps) => {
    const navigate = useNavigate()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleArticleClick = () => {
        navigate(`/concepts/courses/course-details/${id}`)
    }

    const handleDelete = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteClose = () => {
        setIsDeleteDialogOpen(false)
    }

    const handleDeleteConfirm = async () => {
        // Here you would typically make an API call to delete the article
        console.log('Deleting article:', id)
        try {
            await apiDeleteCourse(Number(id))
            toast.push(
                <Notification type="success">
                    Course deleted successfully!
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
        setIsDeleteDialogOpen(false)
    }

    return (
        <div
            className={classNames(
                'flex items-center justify-between py-6 border-gray-200 dark:border-gray-700 group cursor-pointer',
                isLastChild && 'border-b',
            )}
            role="buttton"
        >
            <div
                className="flex items-center gap-4"
                onClick={handleArticleClick}
            >
                <Avatar
                    className="bg-gray-100 dark:bg-gray-700"
                    size={50}
                    icon={
                        <span className="heading-text">
                            {categoryIcon[category]}
                        </span>
                    }
                    shape="round"
                />
                <div>
                    <h6 className="font-bold group-hover:text-primary">
                        {title}
                    </h6>
                    <div className="flex items-center gap-2">
                        <span>{timeToRead} min read</span>
                        <span>•</span>
                        <span>{category}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <IconText
                    className="font-semibold"
                    icon={
                        <TbEdit
                            className="text-xl"
                            onClick={handleArticleClick}
                        />
                    }
                ></IconText>
                <IconText
                    className="font-semibold"
                    icon={
                        <TbTrash
                            className="text-xl"
                            onClick={() => handleDelete()}
                        />
                    }
                ></IconText>
            </div>
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                type="danger"
                title="Delete Course"
                onClose={handleDeleteClose}
                onRequestClose={handleDeleteClose}
                onCancel={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
            >
                <p>
                    Are you sure you want to delete this course? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default Article
