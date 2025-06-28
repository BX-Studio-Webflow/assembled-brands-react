// React Imports
import { useState, useEffect } from 'react'

// Design System Imports
import Card from '@/components/ui/Card'
// import Button from '@/components/ui/Button' // Unused, remove
import Tag from '@/components/ui/Tag'
import Progress from '@/components/ui/Progress'
import Pagination from '@/components/ui/Pagination'
import Switcher from '@/components/ui/Switcher'
import Select from '@/components/ui/Select'

// Type Imports
import { FaChevronRight, FaStar, FaClock } from 'react-icons/fa'
import { FaArrowRotateRight } from 'react-icons/fa6'
import { apiGetCourses } from '@/services/CoursesService'
import useSWR from 'swr'
import { GetCoursesResponse, Course as ServerCourse } from '@/@types/course'
import ReactHtmlParser from 'html-react-parser'

type Course = {
    id: number
    image: string
    user: string
    tutorImg: string
    completedTasks: number
    totalTasks: number
    userCount: number
    note: number
    view: number
    time: string
    logo: string
    color: string
    courseTitle: string
    desc: string
    tags: string
    rating: number
    ratingCount: number
    cover?: {
        id: number
        asset_name: string
        asset_type: string
        presignedUrl: string
        content_type: string
        asset_url: string
        asset_size: string
        duration: number
        hls_url: string | null
        processing_status: string
        upload_id: string | null
        upload_status: string
        user_id: number
        created_at: string
        updated_at: string
    }
}

// Tag color mapping (customize as needed)
const chipColor: { [key: string]: string } = {
    Web: 'bg-primary/10 text-primary',
    Art: 'bg-success/10 text-success',
    'UI/UX': 'bg-error/10 text-error',
    Psychology: 'bg-warning/10 text-warning',
    Design: 'bg-info/10 text-info',
}

// Helper function to convert server course to display course
const convertServerCourseToDisplay = (serverCourse: ServerCourse): Course => {
    // Extract the actual course data from the nested structure
    const courseData = serverCourse.course || serverCourse
    const hostData = serverCourse.host
    const coverData = serverCourse.cover

    // Generate a random tag from available options
    const availableTags = ['Web', 'Art', 'UI/UX', 'Psychology', 'Design']
    const randomTag =
        availableTags[Math.floor(Math.random() * availableTags.length)]

    // Generate random progress data
    const totalTasks = Math.floor(Math.random() * 50) + 10 // 10-60 tasks
    const completedTasks = Math.floor(Math.random() * totalTasks)

    // Generate random time duration
    const hours = Math.floor(Math.random() * 20) + 4 // 4-24 hours
    const minutes = Math.floor(Math.random() * 60)
    const time = `${hours}h ${minutes}m`

    // Generate random user count
    const userCount = Math.floor(Math.random() * 100) + 10 // 10-110 users

    // Generate random note and view counts
    const note = Math.floor(Math.random() * 100) + 10
    const view = Math.floor(Math.random() * 200) + 50

    // Hardcoded rating and rating count
    const rating = 4.4 + Math.random() * 0.5 // 4.4-4.9
    const ratingCount = Math.floor(Math.random() * 100) + 10

    return {
        id: courseData.id,
        image: '/img/avatars/thumb-1.jpg', // Hardcoded image
        user: hostData?.name || 'Unknown Instructor',
        tutorImg: hostData?.profile_image || '/img/avatars/thumb-1.jpg', // Use host image or fallback
        completedTasks,
        totalTasks,
        userCount,
        note,
        view,
        time,
        logo: 'tabler-brand-angular', // Hardcoded logo
        color: 'primary', // Hardcoded color
        courseTitle: courseData.course_name,
        desc: courseData.course_description,
        tags: randomTag,
        rating: Math.round(rating * 10) / 10, // Round to 1 decimal place
        ratingCount,
        cover: coverData,
    }
}

type Props = {
    courseData?: Course[]
    searchValue: string
}

// For Select, use option objects
const courseOptions = [
    { value: 'All', label: 'All Courses' },
    { value: 'Web', label: 'Web' },
    { value: 'Art', label: 'Art' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Design', label: 'Design' },
]

const Courses = (props: Props) => {
    const { searchValue } = props
    // Track selected option as an object
    const [course, setCourse] = useState(courseOptions[0])
    const [hideCompleted, setHideCompleted] = useState(true)
    const [data, setData] = useState<Course[]>([])
    const [activePage, setActivePage] = useState(0)

    const swrKey = [`/course`]
    const { data: coursesResponse, isLoading } = useSWR<GetCoursesResponse>(
        swrKey,
        () => apiGetCourses(),
        { revalidateOnFocus: false },
    )

    useEffect(() => {
        // Convert server courses to display format
        const serverCourses = coursesResponse?.courses || []
        const displayCourses = serverCourses.map(convertServerCourseToDisplay)

        let newData = displayCourses.filter((courseItem) => {
            if (course.value === 'All')
                return (
                    !hideCompleted ||
                    courseItem.completedTasks !== courseItem.totalTasks
                )
            return (
                courseItem.tags === course.value &&
                (!hideCompleted ||
                    courseItem.completedTasks !== courseItem.totalTasks)
            )
        })

        if (searchValue) {
            newData = newData.filter((category) =>
                category.courseTitle
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
            )
        }

        if (activePage > Math.ceil(newData.length / 6)) setActivePage(0)

        setData(newData)
    }, [searchValue, activePage, course, hideCompleted, coursesResponse])

    const handleChange = (checked: boolean) => {
        setHideCompleted(checked)
        setActivePage(0)
    }

    if (isLoading) {
        return (
            <Card className="p-6 bg-transparent shadow-none border-none">
                <div className="text-center text-gray-500 py-8">
                    Loading courses...
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 bg-transparent shadow-none border-none">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <div className="text-2xl font-bold">My Courses</div>
                    <div className="text-gray-500">
                        Total {data.length} course(s) you have purchased
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
                    <div className="min-w-[250px] flex-auto">
                        <Select
                            value={course}
                            onChange={(option) => {
                                setCourse(option || courseOptions[0])
                                setActivePage(0)
                            }}
                            options={courseOptions}
                            className="w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switcher
                            checked={hideCompleted}
                            onChange={handleChange}
                        />
                        <span className="text-sm">Hide completed</span>
                    </div>
                </div>
            </div>
            {data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data
                        .slice(activePage * 6, activePage * 6 + 6)
                        .map((item, index) => (
                            <Card
                                key={index}
                                className="rounded-xl shadow-md border bg-white flex flex-col h-full p-0"
                                header={{
                                    content: (
                                        <div className="rounded-tl-xl rounded-tr-xl overflow-hidden h-48">
                                            {item.cover &&
                                            item.cover.asset_type ===
                                                'video' ? (
                                                <video
                                                    src={
                                                        item.cover.presignedUrl
                                                    }
                                                    className="w-full h-48 object-cover"
                                                    controls
                                                    poster="/img/others/img-1.jpg"
                                                    preload="metadata"
                                                />
                                            ) : (
                                                <img
                                                    src={item.tutorImg}
                                                    alt={item.courseTitle}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                        </div>
                                    ),
                                    bordered: false,
                                    className: 'p-0',
                                }}
                                footer={{
                                    content: (
                                        <div className="flex flex-row gap-3">
                                            <a
                                                href="/apps/academy/course-details"
                                                className="w-full rounded-md py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium transition"
                                            >
                                                Start Over
                                                <FaArrowRotateRight className="ml-2" />
                                            </a>
                                            <a
                                                href="/apps/academy/course-details"
                                                className="w-full rounded-md py-2 bg-primary text-white flex items-center justify-center text-sm font-medium transition"
                                            >
                                                Continue
                                                <FaChevronRight className="ml-2" />
                                            </a>
                                        </div>
                                    ),
                                    bordered: false,
                                }}
                            >
                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <Tag
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${chipColor[item.tags] || ''}`}
                                        >
                                            {item.tags}
                                        </Tag>
                                        <div className="flex items-center text-orange-400 font-semibold text-base">
                                            <span className="mr-1">
                                                {item.rating}
                                            </span>
                                            <FaStar className="text-orange-400" />
                                            <span className="ml-1 text-gray-500 font-normal text-sm">
                                                ({item.ratingCount})
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <a
                                            href={`/apps/academy/course-details`}
                                            className="text-lg font-bold hover:text-primary transition"
                                        >
                                            {item.courseTitle}
                                        </a>
                                        <div className="text-gray-500 text-sm line-clamp-8">
                                            {ReactHtmlParser(item.desc)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                            <FaClock className="text-base" />
                                            <span>{item.time}</span>
                                        </div>
                                        <Progress
                                            percent={Math.floor(
                                                (item.completedTasks /
                                                    item.totalTasks) *
                                                    100,
                                            )}
                                            variant="line"
                                            showInfo={false}
                                            className="w-full h-2 mt-1"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    No courses found
                </div>
            )}
            <div className="flex justify-center mt-8">
                <Pagination
                    currentPage={activePage + 1}
                    total={data.length}
                    pageSize={6}
                    onChange={(page) => setActivePage(page - 1)}
                />
            </div>
        </Card>
    )
}

export default Courses
