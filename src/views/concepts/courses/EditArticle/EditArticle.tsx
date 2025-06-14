import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import EditArticleHeader from './components/EditArticleHeader'
import EditArticleBody from './components/EditArticleBody'
import { useSearchParams } from 'react-router'
import useSWR from 'swr'
import { apiGetLesson } from '@/services/CoursesService'
import { apiGetAssets } from '@/services/AssetService'
import EditArticleFooter from './components/EditArticleFooter'
import { useState, useEffect } from 'react'

const EditArticle = () => {
    const [searchParams] = useSearchParams()
    const courseId = searchParams.get('courseId')
    const moduleId = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')

    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState('')
    const [videoAssetId, setVideoAssetId] = useState(0)

    const { data, isLoading } = useSWR(
        courseId && moduleId && lessonId
            ? [`/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`]
            : null,
        () =>
            apiGetLesson(Number(courseId), Number(moduleId), Number(lessonId)),
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
        },
    )

    useEffect(() => {
        if (data?.lesson) {
            setArticleTitle(data.lesson.title)
            setArticleContent(data.lesson.content)
            setVideoAssetId(data.lesson.video_asset_id)
        }
    }, [data])

    const { data: assetsData } = useSWR('/asset', () => apiGetAssets(), {
        revalidateOnFocus: false,
    })

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
                                    lesson={data}
                                    host={data.host}
                                    assets={assetsData?.assets || []}
                                    title={articleTitle}
                                    onTitleChange={setArticleTitle}
                                    onVideoAssetChange={setVideoAssetId}
                                />
                                <EditArticleBody
                                    content={articleContent}
                                    onContentChange={setArticleContent}
                                />
                                <EditArticleFooter
                                    courseId={courseId}
                                    moduleId={moduleId}
                                    lessonId={lessonId}
                                    title={articleTitle}
                                    content={articleContent}
                                    videoAssetId={videoAssetId}
                                />
                            </>
                        )}
                    </Loading>
                </div>
            </div>
        </Container>
    )
}

export default EditArticle
