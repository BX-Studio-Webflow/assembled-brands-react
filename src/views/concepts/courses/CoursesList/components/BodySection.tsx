import Container from '@/components/shared/Container'

import ArticleList from './ArticleList'
import { useHelpCenterStore } from '../store/helpCenterStore'
import { GetCoursesResponse } from '@/@types/course'

const BodySection = ({
    courses,
    isLoading,
}: {
    courses: GetCoursesResponse | undefined
    isLoading: boolean
}) => {
    const queryText = useHelpCenterStore((state) => state.queryText)
    const selectedTopic = useHelpCenterStore((state) => state.selectedTopic)

    return (
        <div className="my-12">
            <Container>
                <div className="max-w-[1200px] mx-auto px-6">
                    <ArticleList
                        courses={courses}
                        query={queryText}
                        topic={selectedTopic}
                        isLoading={isLoading}
                    />
                </div>
            </Container>
        </div>
    )
}

export default BodySection
