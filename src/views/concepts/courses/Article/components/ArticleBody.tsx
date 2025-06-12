import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import ReactHtmlParser from 'html-react-parser'
import type { ArticleContent } from '../types'
import { CourseWithDetails } from '@/@types/course'

const ArticleBody = (course: CourseWithDetails) => {
    return (
        <>
            <h3>{course.course.course_name}</h3>
            <div className="flex items-center mt-6 gap-4">
                <UsersAvatarGroup
                    avatarProps={{ size: 40 }}
                    users={[course.host]}
                />
                <div className="text-xs">
                    <div className="mb-1">
                        Created by:
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {course.host.name}
                        </span>
                    </div>
                    <div>
                        <span>Last updated: {course.course.updated_at}</span>
                        <span className="mx-2">•</span>
                        <span>{course.course.created_at} min read</span>
                        <span className="mx-2">•</span>
                        <span>{course.course.created_at} viewed</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 prose dark:prose-invert max-w-none prose-p:mt-2 prose-headings:font-bold">
                {ReactHtmlParser(data.content || '')}
            </div>
        </>
    )
}

export default ArticleBody
