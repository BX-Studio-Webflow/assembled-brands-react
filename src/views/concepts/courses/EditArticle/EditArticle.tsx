import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import EditArticleHeader from './components/EditArticleHeader'
import EditArticleBody from './components/EditArticleBody'
import { useSearchParams } from 'react-router'
import useSWR from 'swr'
import { apiGetLesson } from '@/services/CoursesService'

const EditArticle = () => {
    const [searchParams] = useSearchParams()
    const courseId = searchParams.get('courseId')
    const moduleId = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')

    const { data, isLoading } = useSWR(
        courseId && moduleId && lessonId
            ? [`/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`]
            : null,
        () =>
            apiGetLesson(Number(courseId), Number(moduleId), Number(lessonId)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    return (
        <Container>
            <div className="lg:flex gap-4">
                <div className="my-6 max-w-[800px] w-full mx-auto">
                    <Loading
                        loading={isLoading}
                        customLoader={
                            <div className="flex flex-col gap-8">
                                <MediaSkeleton />
                                <TextBlockSkeleton rowCount={6} />
                                <TextBlockSkeleton rowCount={4} />
                                <TextBlockSkeleton rowCount={8} />
                            </div>
                        }
                    >
                        {data && (
                            <>
                                <EditArticleHeader
                                    lesson={data.lesson}
                                    host={data.host}
                                />
                                <EditArticleBody lesson={data.lesson} />
                            </>
                        )}
                    </Loading>
                </div>
            </div>
        </Container>
    )
}

export default EditArticle
