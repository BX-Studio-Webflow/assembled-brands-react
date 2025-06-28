import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import ArticleBody from './components/ArticleBody'
import ArticleAction from './components/ArticleAction'
import useSWR from 'swr'
import { apiGetLesson } from '@/services/CoursesService'
import { useState, useEffect } from 'react'

const Article = () => {
    const [params, setParams] = useState<{
        courseId: string
        moduleId: string
        lessonId: string
    }>({
        courseId: '',
        moduleId: '',
        lessonId: '',
    })

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const courseId = urlParams.get('courseId')
        const moduleId = urlParams.get('moduleId')
        const lessonId = urlParams.get('lessonId')

        if (courseId && moduleId && lessonId) {
            setParams({ courseId, moduleId, lessonId })
        }
    }, [])
    const { data, isLoading } = useSWR(
        params.courseId && params.moduleId && params.lessonId
            ? [
                  `/course/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}`,
              ]
            : null,
        () =>
            apiGetLesson(
                Number(params.courseId),
                Number(params.moduleId),
                Number(params.lessonId),
            ),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
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
                        {data && <ArticleBody lesson={data} />}
                    </Loading>
                    <ArticleAction />
                </div>
            </div>
        </Container>
    )
}

export default Article
