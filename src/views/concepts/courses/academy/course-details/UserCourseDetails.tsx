import { apiGetCourse } from '@/services/CoursesService'
import Details from './Details'
import Sidebar from './Sidebar'
import useSWR from 'swr'
import { useParams } from 'react-router'
import Skeleton from '@/components/ui/Skeleton'

const DetailsSkeleton = () => (
    <div className="w-full max-w-3xl mx-auto p-0 bg-white rounded-xl">
        {/* Header image/video skeleton */}
        <div className="rounded-t-xl overflow-hidden h-56 bg-gray-100 flex items-center justify-center">
            <Skeleton height={224} width="100%" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
            <div>
                <Skeleton height={28} width={220} className="mb-2" />
                <Skeleton height={18} width={120} />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton height={28} width={60} />
                <Skeleton height={32} width={32} variant="circle" />
                <Skeleton height={32} width={32} variant="circle" />
            </div>
        </div>
        <div className="p-6 pt-4">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Skeleton height={20} width={180} />
                    <Skeleton height={14} width="100%" />
                    <Skeleton height={14} width="90%" />
                    <Skeleton height={14} width="80%" />
                </div>
            </div>
        </div>
        {/* Footer */}
        <div className="flex items-center p-4">
            <Skeleton
                variant="circle"
                height={30}
                width={30}
                className="mr-2"
            />
            <div className="flex flex-col gap-1">
                <Skeleton height={14} width={80} />
                <Skeleton height={10} width={60} />
            </div>
        </div>
    </div>
)

const SidebarSkeleton = () => (
    <div className="w-full max-w-md bg-gray-50 p-0 rounded-xl">
        <div className="p-4 border-b border-gray-200">
            <Skeleton height={20} width={120} className="mb-1" />
            <Skeleton height={12} width={80} />
        </div>
        <div className="p-4">
            {[...Array(3)].map((_, idx) => (
                <div key={idx} className="mb-4">
                    <Skeleton height={18} width={180} className="mb-2" />
                    <div className="bg-white rounded p-3">
                        {[...Array(3)].map((_, j) => (
                            <div
                                key={j}
                                className="flex items-center gap-3 mb-2"
                            >
                                <Skeleton
                                    variant="circle"
                                    height={18}
                                    width={18}
                                />
                                <div className="flex-1">
                                    <Skeleton height={12} width={120} />
                                    <Skeleton height={10} width={60} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const LoadingSkeleton = () => (
    <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
            <DetailsSkeleton />
        </div>
        <div className="w-full md:w-[350px]">
            <SidebarSkeleton />
        </div>
    </div>
)

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

    if (!data) return <LoadingSkeleton />

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <Details data={data} />
            <div className="w-full md:w-[350px]">
                <Sidebar data={data} />
            </div>
        </div>
    )
}
