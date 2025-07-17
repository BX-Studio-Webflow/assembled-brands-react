import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ReactHtmlParser from 'html-react-parser'
import type { Lesson } from '@/@types/course'

interface ArticleBodyProps {
    lesson: Lesson
}

const ArticleBody = ({ lesson }: ArticleBodyProps) => {
    return (
        <>
            <h3>{lesson.lesson.title}</h3>
            <div className="flex items-center mt-6 gap-4">
                <UsersAvatarGroup
                    avatarProps={{ size: 40 }}
                    users={[
                        {
                            name: 'John Doe',
                            profile_image: 'https://via.placeholder.com/150',
                        },
                    ]}
                />
                <div className="text-xs">
                    <div className="mb-1">
                        Created by:
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {lesson.host?.name}
                        </span>
                    </div>
                    <div>
                        <span>Last updated: {lesson.lesson.updated_at}</span>
                        <span className="mx-2">•</span>
                        <span>{lesson.lesson.lesson_duration} min read</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 prose dark:prose-invert max-w-none prose-p:mt-2 prose-headings:font-bold">
                {ReactHtmlParser(lesson.lesson.content || '')}
            </div>
        </>
    )
}

export default ArticleBody
