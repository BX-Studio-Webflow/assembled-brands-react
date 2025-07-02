import { lazy } from 'react'
import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const conceptsRoute: Routes = [
    {
        key: 'concepts.ai.chat',
        path: `${CONCEPTS_PREFIX_PATH}/ai/chat`,
        component: lazy(() => import('@/views/concepts/ai/Chat')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.ai.image',
        path: `${CONCEPTS_PREFIX_PATH}/ai/image`,
        component: lazy(() => import('@/views/concepts/ai/Image')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.customers.customerList',
        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-list`,
        component: lazy(() => import('@/views/concepts/leads/LeadList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'concepts.customers.customerEdit',
        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-edit/:id`,
        component: lazy(() => import('@/views/concepts/leads/LeadEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit customer',
                description:
                    'Manage customer details, purchase history, and preferences.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'concepts.customers.customerCreate',
        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-create`,
        component: lazy(() => import('@/views/concepts/leads/LeadCreate')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create lead',
                description:
                    'Manage lead details, track purchases, and update preferences easily.',
                contained: true,
            },
            footer: false,
        },
    },

    {
        key: 'concepts.events.eventList',
        path: `${CONCEPTS_PREFIX_PATH}/event/event-list`,
        component: lazy(() => import('@/views/concepts/events/EventList')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.events.eventEdit',
        path: `${CONCEPTS_PREFIX_PATH}/event/event-edit/:id`,
        component: lazy(() => import('@/views/concepts/events/EventEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit event',
                contained: true,
                description: 'Manage and track events efficiently',
            },
            footer: false,
        },
    },
    {
        key: 'concepts.events.eventCreate',
        path: `${CONCEPTS_PREFIX_PATH}/event/event-create`,
        component: lazy(() => import('@/views/concepts/events/EventCreate')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create event',
                contained: true,
                description: 'Create new event quickly and accurately',
            },
            footer: false,
        },
    },
    {
        key: 'concepts.events.eventStream',
        path: `${CONCEPTS_PREFIX_PATH}/event/stream/:id`,
        component: lazy(() => import('@/views/concepts/events/EventStream')),
        authority: [ADMIN, USER],
    },

    {
        key: 'concepts.products.productList',
        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-list`,
        component: lazy(() => import('@/views/concepts/podcasts/PodcastList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'concepts.products.productEdit',
        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-edit/:id`,
        component: lazy(() => import('@/views/concepts/podcasts/PodcastEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit product',
                description:
                    'Quickly manage product details, stock, and availability.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'concepts.products.productCreate',
        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-create`,
        component: lazy(
            () => import('@/views/concepts/podcasts/PodcastCreate'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create podcast',
                description:
                    'Quickly add podcasts to your inventory. Enter key details, manage stock, and set availability.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'concepts.memberships.membershipList',
        path: `${CONCEPTS_PREFIX_PATH}/memberships/membership-list`,
        component: lazy(
            () => import('@/views/concepts/memberships/MembershipList'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'concepts.memberships.membershipEdit',
        path: `${CONCEPTS_PREFIX_PATH}/memberships/membership-edit/:id`,
        component: lazy(
            () => import('@/views/concepts/memberships/MembershipEdit'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Edit membership',
                description:
                    'Quickly manage membership details, stock, and availability.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'concepts.memberships.membershipCreate',
        path: `${CONCEPTS_PREFIX_PATH}/memberships/membership-create`,
        component: lazy(
            () => import('@/views/concepts/memberships/MembershipCreate'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Create membership',
                description:
                    'Quickly add memberships to your inventory. Enter key details, manage stock, and set availability.',
                contained: true,
            },
            footer: false,
        },
    },
    {
        key: 'concepts.projects.scrumBoard',
        path: `${CONCEPTS_PREFIX_PATH}/projects/scrum-board`,
        component: lazy(() => import('@/views/concepts/projects/ScrumBoard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.projects.projectList',
        path: `${CONCEPTS_PREFIX_PATH}/projects/project-list`,
        component: lazy(() => import('@/views/concepts/projects/ProjectList')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },

    {
        key: 'concepts.projects.projectTasks',
        path: `${CONCEPTS_PREFIX_PATH}/projects/tasks`,
        component: lazy(() => import('@/views/concepts/projects/Tasks')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.projects.projectIssue',
        path: `${CONCEPTS_PREFIX_PATH}/projects/tasks/:id`,
        component: lazy(() => import('@/views/concepts/projects/Issue')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.account.settings',
        path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
        component: lazy(() => import('@/views/concepts/accounts/Settings')),
        authority: [ADMIN, USER],
        meta: {
            header: {
                title: 'Settings',
            },
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.account.activityLog',
        path: `${CONCEPTS_PREFIX_PATH}/account/activity-log`,
        component: lazy(() => import('@/views/concepts/accounts/ActivityLog')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.account.rolesPermissions',
        path: `${CONCEPTS_PREFIX_PATH}/account/roles-permissions`,
        component: lazy(
            () => import('@/views/concepts/accounts/RolesPermissions'),
        ),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.helpCenter.supportHub',
        path: `${CONCEPTS_PREFIX_PATH}/courses/courses-list`,
        component: lazy(() => import('@/views/concepts/courses/CoursesList')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.helpCenter.article',
        path: `${CONCEPTS_PREFIX_PATH}/courses/article`,
        component: lazy(() => import('@/views/concepts/courses/Article')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.helpCenter.editArticle',
        path: `${CONCEPTS_PREFIX_PATH}/courses/edit-article`,
        component: lazy(() => import('@/views/concepts/courses/EditArticle')),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            footer: false,
        },
    },
    ////academy/course-details
    {
        key: 'concepts.academy.mycourses',
        path: `${CONCEPTS_PREFIX_PATH}/courses/host/:id`,
        component: lazy(
            () => import('@/views/concepts/courses/academy/host/HostCourses'),
        ),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            footer: false,
        },
    },
    {
        key: 'concepts.academy.coursedetails',
        path: `${CONCEPTS_PREFIX_PATH}/courses/academy/course-details/:id`,
        component: lazy(
            () =>
                import(
                    '@/views/concepts/courses/academy/course-details/UserCourseDetails'
                ),
        ),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            footer: false,
        },
    },
    {
        key: 'concepts.helpCenter.createCourse',
        path: `${CONCEPTS_PREFIX_PATH}/courses/create-course`,
        component: lazy(() => import('@/views/concepts/courses/CreateCourse')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.helpCenter.addArticle',
        path: `${CONCEPTS_PREFIX_PATH}/courses/add-article`,
        component: lazy(() => import('@/views/concepts/courses/AddArticle')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.projects.projectDetails',
        path: `${CONCEPTS_PREFIX_PATH}/courses/course-details/:id`,
        component: lazy(() => import('@/views/concepts/courses/CourseDetails')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.calendar',
        path: `${CONCEPTS_PREFIX_PATH}/calendar`,
        component: lazy(() => import('@/views/concepts/calendar/Calendar')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.fileManager',
        path: `${CONCEPTS_PREFIX_PATH}/file-manager`,
        component: lazy(() => import('@/views/concepts/files/FileManager')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
    {
        key: 'concepts.mail',
        path: `${CONCEPTS_PREFIX_PATH}/mail`,
        component: lazy(() => import('@/views/concepts/mail/Mail')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'concepts.chat',
        path: `${CONCEPTS_PREFIX_PATH}/chat`,
        component: lazy(() => import('@/views/concepts/chat/Chat')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default conceptsRoute
