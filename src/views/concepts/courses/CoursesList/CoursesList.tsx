import TopSection from './components/TopSection'
import BodySection from './components/BodySection'
import useSWR from 'swr'
import { apiGetCourses } from '@/services/CoursesService'

const CoursesList = () => {
    const { data, isLoading } = useSWR(
        [`/course`, {}],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetCourses(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )
    return (
        <>
            <TopSection courses={data} isLoading={isLoading} />
            <BodySection courses={data} isLoading={isLoading} />
        </>
    )
}

export default CoursesList
