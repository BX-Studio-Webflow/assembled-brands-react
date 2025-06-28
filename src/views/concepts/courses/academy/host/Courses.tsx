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
// import type { Course } from '@/types/apps/academyTypes'

import { FaChevronRight, FaStar, FaClock } from 'react-icons/fa'

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
}

// Tag color mapping (customize as needed)
const chipColor: { [key: string]: string } = {
    Web: 'bg-primary/10 text-primary',
    Art: 'bg-success/10 text-success',
    'UI/UX': 'bg-error/10 text-error',
    Psychology: 'bg-warning/10 text-warning',
    Design: 'bg-info/10 text-info',
}

// Dummy data for 6 courses
const dummyCourses: Course[] = [
    {
        id: 1,
        image: '/img/avatars/thumb-1.jpg',
        user: 'John Doe',
        tutorImg: '/img/avatars/thumb-1.jpg',
        completedTasks: 10,
        totalTasks: 20,
        userCount: 18,
        note: 20,
        view: 83,
        time: '17h 34m',
        logo: 'tabler-brand-angular',
        color: 'primary',
        courseTitle: 'Basics of Angular',
        desc: 'Introductory course for Angular and framework basics with TypeScript',
        tags: 'Web',
        rating: 4.4,
        ratingCount: 8,
    },
    {
        id: 2,
        image: '/img/avatars/thumb-2.jpg',
        user: 'Jane Smith',
        tutorImg: '/img/avatars/thumb-2.jpg',
        completedTasks: 15,
        totalTasks: 30,
        userCount: 14,
        note: 48,
        view: 43,
        time: '19h 17m',
        logo: 'tabler-palette',
        color: 'success',
        courseTitle: 'UI/UX Design',
        desc: 'Learn how to design a beautiful & engaging mobile app with Figma',
        tags: 'Design',
        rating: 4.9,
        ratingCount: 10,
    },
    {
        id: 3,
        image: '/img/avatars/thumb-3.jpg',
        user: 'Alice Brown',
        tutorImg: '/img/avatars/thumb-3.jpg',
        completedTasks: 25,
        totalTasks: 50,
        userCount: 19,
        note: 81,
        view: 88,
        time: '16h 16m',
        logo: 'tabler-brand-react-native',
        color: 'info',
        courseTitle: 'React Native',
        desc: 'Master React.js: Build dynamic web apps with front-end technology',
        tags: 'Web',
        rating: 4.8,
        ratingCount: 9,
    },
    {
        id: 4,
        image: '/img/avatars/thumb-4.jpg',
        user: 'Bob Lee',
        tutorImg: '/img/avatars/thumb-4.jpg',
        completedTasks: 18,
        totalTasks: 18,
        userCount: 28,
        note: 21,
        view: 87,
        time: '15h 49m',
        logo: 'tabler-pencil',
        color: 'success',
        courseTitle: 'Art & Drawing',
        desc: 'Easy-to-follow video & guides show you how to draw animals & people.',
        tags: 'Design',
        rating: 4.7,
        ratingCount: 18,
    },
    {
        id: 5,
        image: '/img/avatars/thumb-5.jpg',
        user: 'Carol White',
        tutorImg: '/img/avatars/thumb-5.jpg',
        completedTasks: 12,
        totalTasks: 24,
        userCount: 13,
        note: 19,
        view: 13,
        time: '12h 42m',
        logo: 'tabler-star',
        color: 'primary',
        courseTitle: 'React for Beginners',
        desc: 'Learn React in just a couple of afternoons with this immersive course',
        tags: 'Web',
        rating: 4.5,
        ratingCount: 68,
    },
    {
        id: 6,
        image: '/img/avatars/thumb-6.jpg',
        user: 'David Green',
        tutorImg: '/img/avatars/thumb-6.jpg',
        completedTasks: 5,
        totalTasks: 10,
        userCount: 74,
        note: 21,
        view: 60,
        time: '4h 59m',
        logo: 'tabler-star',
        color: 'warning',
        courseTitle: 'The Science of Critical Thinking',
        desc: 'Learn how to improve your arguments & make better decisions',
        tags: 'Psychology',
        rating: 4.4,
        ratingCount: 64,
    },
]

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
    const { courseData = dummyCourses, searchValue } = props
    // Track selected option as an object
    const [course, setCourse] = useState(courseOptions[0])
    const [hideCompleted, setHideCompleted] = useState(true)
    const [data, setData] = useState<Course[]>([])
    const [activePage, setActivePage] = useState(0)

    useEffect(() => {
        let newData =
            courseData?.filter((courseItem) => {
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
            }) ?? []

        if (searchValue) {
            newData = newData.filter((category) =>
                category.courseTitle
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
            )
        }

        if (activePage > Math.ceil(newData.length / 6)) setActivePage(0)

        setData(newData)
    }, [searchValue, activePage, course, hideCompleted, courseData])

    const handleChange = (checked: boolean) => {
        setHideCompleted(checked)
        setActivePage(0)
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
                            >
                                <div className="p-0">
                                    <a
                                        href={`/apps/academy/course-details`}
                                        className="block"
                                    >
                                        <img
                                            src={item.tutorImg}
                                            alt={item.courseTitle}
                                            className="w-full h-48 object-cover rounded-t-xl"
                                        />
                                    </a>
                                </div>
                                <div className="flex flex-col gap-4 p-5 flex-1">
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
                                        <div className="text-gray-500 text-sm">
                                            {item.desc}
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
                                    <div className="flex flex-row gap-3 mt-2">
                                        <a
                                            href="/apps/academy/course-details"
                                            className="w-full rounded-md py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-medium transition"
                                        >
                                            Start Over
                                        </a>
                                        <a
                                            href="/apps/academy/course-details"
                                            className="w-full rounded-md py-2 bg-primary text-white flex items-center justify-center text-sm font-medium transition"
                                        >
                                            Continue
                                            <FaChevronRight className="ml-2" />
                                        </a>
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
