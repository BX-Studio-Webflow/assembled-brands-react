import { apiGetCourse } from '@/services/CoursesService'
import Details from './Details'
import Sidebar from './Sidebar'
import useSWR from 'swr'
import { useParams } from 'react-router'

export default function UserCourseDetails() {
    const { id } = useParams()
    const { data } = useSWR(
        id ? `/course/${id}` : null,
        () => apiGetCourse(Number(id)),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        },
    )

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <Details data={data} />
            </div>
            <div className="w-full md:w-[350px]">
                <Sidebar data={data} />
            </div>
        </div>
    )
}
