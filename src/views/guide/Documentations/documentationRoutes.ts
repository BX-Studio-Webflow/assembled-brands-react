import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const documentationRoutes: DocumentationRoute[] = [
    {
        groupName: 'Getting Started',
        nav: [
            {
                path: 'introduction',
                label: 'Introduction',
                component: lazy(() => import('./components/Introduction')),
            },
            {
                path: 'user-guide',
                label: 'User Guide',
                component: lazy(() => import('./components/UserGuide')),
            },
            {
                path: 'faq',
                label: 'FAQ',
                component: lazy(() => import('./components/FAQ')),
            },
        ],
    },
    {
        groupName: 'Application Features',
        nav: [
            {
                path: 'lead-management',
                label: 'Lead Management',
                component: lazy(() => import('./components/LeadManagement')),
            },
            {
                path: 'event-management',
                label: 'Event Management',
                component: lazy(() => import('./components/EventManagement')),
            },
            {
                path: 'podcast-management',
                label: 'Podcast Management',
                component: lazy(() => import('./components/PodcastManagement')),
            },
            {
                path: 'course-management',
                label: 'Course Management',
                component: lazy(() => import('./components/CourseManagement')),
            },
            {
                path: 'membership-management',
                label: 'Membership Management',
                component: lazy(
                    () => import('./components/MembershipManagement'),
                ),
            },
            {
                path: 'file-management',
                label: 'File Management',
                component: lazy(() => import('./components/FileManagement')),
            },
            {
                path: 'messaging-system',
                label: 'Messaging System',
                component: lazy(() => import('./components/MessagingSystem')),
            },
        ],
    },
]

export default documentationRoutes
