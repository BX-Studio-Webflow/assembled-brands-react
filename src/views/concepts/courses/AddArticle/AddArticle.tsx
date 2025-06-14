import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import AddArticleHeader from './components/AddArticleHeader'
import AddArticleBody from './components/AddArticleBody'
import { useSearchParams } from 'react-router'
import useSWR from 'swr'
import { apiGetCourse } from '@/services/CoursesService'
import AddArticleFooter from './components/AddArticleFooter'
import { useState } from 'react'
import { apiGetAssets } from '@/services/AssetService'

const AddArticle = () => {
    const [searchParams] = useSearchParams()
    const courseId = searchParams.get('courseId')
    const moduleId = searchParams.get('moduleId')

    const [articleTitle, setArticleTitle] = useState('')
    const [articleContent, setArticleContent] = useState('')
    const [videoAssetId, setVideoAssetId] = useState(0)

    const { data, isLoading } = useSWR(
        `/course/${courseId}`,
        () => apiGetCourse(Number(courseId)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )
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
                                <AddArticleHeader
                                    host={data.host}
                                    title={articleTitle}
                                    assets={assetsData?.assets || []}
                                    onTitleChange={setArticleTitle}
                                    onVideoAssetChange={setVideoAssetId}
                                />
                                <AddArticleBody
                                    onContentChange={setArticleContent}
                                />
                                <AddArticleFooter
                                    courseId={courseId}
                                    moduleId={moduleId}
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

export default AddArticle
