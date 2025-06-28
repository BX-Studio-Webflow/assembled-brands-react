'use client'

import Tag from '@/components/ui/Tag/Tag'
import Avatar from '@/components/ui/Avatar/Avatar'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import ReactHtmlParser from 'html-react-parser'
import dayjs from 'dayjs'
import type { CourseWithDetails } from '@/@types/course'
import { HiCreditCard } from 'react-icons/hi'
import CheckoutDialog from './CheckoutDialog'
import { useState } from 'react'

const Details = ({ data }: { data: CourseWithDetails | undefined }) => {
    const course = data?.course
    const cover = data?.cover
    const host = data?.host
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)

    if (!data || !course) return null

    const handleBuyCourseClick = () => {
        setIsCheckoutDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsCheckoutDialogOpen(false)
    }

    return (
        <Card
            className="w-full max-w-8xl mx-auto p-0"
            header={{
                content: (
                    <div className="rounded-t-xl overflow-hidden h-56 bg-gray-100 flex items-center justify-center">
                        {cover && cover.asset_type === 'video' ? (
                            <video
                                controls
                                src={cover.presignedUrl || cover.asset_url}
                                className="w-full h-56 object-cover"
                                poster={host?.profile_image}
                                preload="metadata"
                            />
                        ) : (
                            <img
                                src={cover?.presignedUrl || cover?.asset_url}
                                alt={course?.course_name}
                                className="w-full h-56 object-cover"
                            />
                        )}
                    </div>
                ),
                bordered: false,
                className: 'p-0',
            }}
            footer={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar
                                size={30}
                                className="mr-2"
                                shape="circle"
                                src={host?.profile_image}
                            />
                            <span>
                                <h6 className="text-sm">{host?.name}</h6>
                                <span className="text-xs">
                                    {course?.created_at
                                        ? dayjs(course.created_at).format(
                                              'DD MMM YYYY',
                                          )
                                        : ''}
                                </span>
                            </span>
                        </div>
                        <Button
                            className="mr-2"
                            icon={<HiCreditCard />}
                            onClick={handleBuyCourseClick}
                        >
                            <span>
                                <span>Buy this course</span>
                            </span>
                        </Button>
                    </div>
                ),
                bordered: false,
            }}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {course?.course_name}
                    </h1>
                    <p className="text-gray-700 mt-1">
                        By{' '}
                        <span className="font-medium text-primary">
                            {host?.name}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Tag className="bg-red-100 text-red-700 font-semibold px-3 py-1 rounded">
                        Animation
                    </Tag>
                    <Button variant="plain" size="sm" className="p-2">
                        <i className="tabler-share" />
                    </Button>
                    <Button variant="plain" size="sm" className="p-2">
                        <i className="tabler-bookmarks" />
                    </Button>
                </div>
            </div>
            <div className="p-6 pt-4">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">
                            About this course
                        </h2>
                        <div className="text-gray-700">
                            {ReactHtmlParser(course?.course_description || '')}
                        </div>
                    </div>
                </div>
            </div>
            <CheckoutDialog
                isOpen={isCheckoutDialogOpen}
                courseId={course.id}
                courseTitle={course.course_name}
                onClose={handleDialogClose}
            />
        </Card>
    )
}

export default Details
