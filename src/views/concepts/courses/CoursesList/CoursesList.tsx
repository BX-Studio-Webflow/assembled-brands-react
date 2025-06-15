import TopSection from './components/TopSection'
import BodySection from './components/BodySection'
import useSWR from 'swr'
import { apiGetCourses } from '@/services/CoursesService'

const CoursesList = () => {
    const { data, isLoading } = useSWR(`/course`, () => apiGetCourses())
    return (
        <>
            <TopSection />
            <BodySection courses={data} isLoading={isLoading} />
        </>
    )
}

export default CoursesList
