import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import ReactHtmlParser from 'html-react-parser'
import dayjs from 'dayjs'
import type { CourseWithDetails } from '@/@types/course'

type CourseOverviewProps = {
    course: CourseWithDetails
}

const Overview = ({ course }: CourseOverviewProps) => {
    const totalLessons = 6

    const totalDuration = 7

    return (
        <div className="flex flex-col lg:flex-row flex-auto gap-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">
                    {course.course.course_name}
                </h1>
                <div className="prose max-w-full">
                    {ReactHtmlParser(course.course.course_description)}
                </div>
            </div>
            <div className="lg:min-w-[320px] lg:w-[350px]">
                <Card
                    bordered={false}
                    className="bg-gray-100 dark:bg-gray-800 shadow-none"
                >
                    <h5>Course Information</h5>
                    <div className="flex flex-col gap-5 mt-6">
                        <div>
                            <span className="font-semibold heading-text">
                                Course Type:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {course.course.course_type.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="font-semibold heading-text">
                                Instructor:
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size={25}
                                    src={course.host.profile_image}
                                    alt=""
                                />
                                <span className="font-semibold">
                                    {course.host.name}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold heading-text">
                                Total Lessons:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {totalLessons}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold heading-text">
                                Total Duration:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {totalDuration} minutes
                            </span>
                        </div>
                    </div>
                </Card>
                <Card
                    bordered={false}
                    className="bg-gray-100 dark:bg-gray-800 shadow-none mt-6"
                >
                    <h5>Course Details</h5>
                    <div className="flex flex-col gap-5 mt-6">
                        <div>
                            <span className="font-semibold heading-text">
                                Created:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {dayjs(course.course.created_at).format(
                                    'ddd, DD MMM YYYY',
                                )}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold heading-text">
                                Last Updated:
                            </span>
                            <span className="font-semibold">
                                {' '}
                                {dayjs(course.course.updated_at).format(
                                    'ddd, DD MMM YYYY',
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold heading-text">
                                Status:
                            </span>
                            <Tag
                                className={`border-2 bg-transparent rounded-full ${
                                    course.course.status === 'published'
                                        ? 'text-green-600 border-green-600 dark:text-green-600 dark:border-green-600'
                                        : course.course.status === 'draft'
                                          ? 'text-yellow-600 border-yellow-600 dark:text-yellow-600 dark:border-yellow-600'
                                          : 'text-gray-600 border-gray-600 dark:text-gray-600 dark:border-gray-600'
                                }`}
                            >
                                {course.course.status}
                            </Tag>
                        </div>
                        {course.memberships &&
                            course.memberships.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <span className="font-semibold heading-text">
                                        Available Plans:
                                    </span>
                                    {course.memberships.map((membership) => (
                                        <div
                                            key={membership.id}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="font-semibold">
                                                {membership.name}
                                            </span>
                                            <span className="font-semibold">
                                                {membership.price === 0
                                                    ? 'Free'
                                                    : `$${membership.price}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Overview
