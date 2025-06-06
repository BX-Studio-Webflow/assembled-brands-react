import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const conceptsNavigationConfig: NavigationTree[] = [
    {
        key: 'concepts',
        path: '',
        title: 'Concepts',
        translateKey: 'nav.concepts',
        icon: 'concepts',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 4,
            },
        },
        subMenu: [
            {
                key: 'concepts.customers',
                path: '',
                title: 'Leads',
                translateKey: 'nav.conceptsCustomers.customers',
                icon: 'customers',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsCustomers.customersDesc',
                        label: 'Lead management',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.customers.customerList',
                        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-list`,
                        title: 'Lead List',
                        translateKey: 'nav.conceptsCustomers.customerList',
                        icon: 'customerList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.customerListDesc',
                                label: 'List of all leads',
                            },
                        },
                        subMenu: [],
                    },
                     {
                        key: 'concepts.customers.customerEdit',
                        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-edit/1`,
                        title: 'Customer Edit',
                        translateKey: 'nav.conceptsCustomers.customerEdit',
                        icon: 'customerEdit',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.customerEditDesc',
                                label: 'Edit customer info',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.customers.customerCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-create`,
                        title: 'Customer Create',
                        translateKey: 'nav.conceptsCustomers.customerCreate',
                        icon: 'customerCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.customerCreateDesc',
                                label: 'Add a new customer',
                            },
                        },
                        subMenu: [],
                    },
                    /* {
                        key: 'concepts.customers.customerDetails',
                        path: `${CONCEPTS_PREFIX_PATH}/lead/lead-details/1`,
                        title: 'Customer Details',
                        translateKey: 'nav.conceptsCustomers.customerDetails',
                        icon: 'customerDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.customerDetailsDesc',
                                label: 'Detailed customer info',
                            },
                        },
                        subMenu: [],
                    },*/
                ],
            },
            {
                key: 'concepts.events',
                path: '',
                title: 'Events',
                translateKey: 'nav.conceptsEvents.events',
                icon: 'dataDisplay',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsEvents.eventsDesc',
                        label: 'Customer events management',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.events.eventList',
                        path: `${CONCEPTS_PREFIX_PATH}/event/event-list`,
                        title: 'Event List',
                        translateKey: 'nav.conceptsEvents.eventList',
                        icon: 'orderList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsEvents.eventListDesc',
                                label: 'View all customer events',
                            },
                        },
                        subMenu: [],
                    },
                    /*{
                        key: 'concepts.events.eventEdit',
                        path: `${CONCEPTS_PREFIX_PATH}/event/event-edit/95954`,
                        title: 'Event Edit',
                        translateKey: 'nav.conceptsEvents.eventEdit',
                        icon: 'orderEdit',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsEvents.eventEditDesc',
                                label: 'Edit event details',
                            },
                        },
                        subMenu: [],
                    },*/
                    {
                        key: 'concepts.events.eventCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/event/event-create`,
                        title: 'Event Create',
                        translateKey: 'nav.conceptsEvents.eventCreate',
                        icon: 'orderCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsEvents.eventCreateDesc',
                                label: 'Create new event',
                            },
                        },
                        subMenu: [],
                    },
                    /*{
                        key: 'concepts.events.eventDetails',
                        path: `${CONCEPTS_PREFIX_PATH}/event/event-details/95954`,
                        title: 'Event Details',
                        translateKey: 'nav.conceptsEvents.eventDetails',
                        icon: 'ordeDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsEvents.eventDetailsDesc',
                                label: 'Detailed event information',
                            },
                        },
                        subMenu: [],
                    },*/
                ],
            },

            {
                key: 'concepts.fileManager',
                path: `${CONCEPTS_PREFIX_PATH}/file-manager`,
                title: 'File Manager',
                translateKey: 'nav.fileManager',
                icon: 'fileManager',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.fileManagerDesc',
                        label: 'Manage your files',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.products',
                path: '',
                title: 'Podcasts',
                translateKey: 'nav.conceptsProducts.products',
                icon: 'products',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsProducts.productsDesc',
                        label: 'Product inventory management',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.products.productList',
                        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-list`,
                        title: 'Product List',
                        translateKey: 'nav.conceptsProducts.productList',
                        icon: 'productList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productListDesc',
                                label: 'All products listed',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.products.productEdit',
                        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-edit/12`,
                        title: 'Product Edit',
                        translateKey: 'nav.conceptsProducts.productEdit',
                        icon: 'productEdit',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productEditDesc',
                                label: 'Edit product details',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.products.productCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/podcasts/podcast-create`,
                        title: 'Product Create',
                        translateKey: 'nav.conceptsProducts.productCreate',
                        icon: 'productCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProducts.productCreateDesc',
                                label: 'Add new product',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.projects',
                path: '',
                title: 'Projects',
                translateKey: 'nav.conceptsProjects.projects',
                icon: 'projects',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsProjects.projectsDesc',
                        label: 'Manage and track projects',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.projects.scrumBoard',
                        path: `${CONCEPTS_PREFIX_PATH}/projects/scrum-board`,
                        title: 'Scrum Board',
                        translateKey: 'nav.conceptsProjects.scrumBoard',
                        icon: 'projectScrumBoard',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProjects.scrumBoardDesc',
                                label: 'Manage your scrum workflow',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.projects.projectList',
                        path: `${CONCEPTS_PREFIX_PATH}/projects/project-list`,
                        title: 'Project List',
                        translateKey: 'nav.conceptsProjects.projectList',
                        icon: 'projectList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProjects.projectListDesc',
                                label: 'Organize all projects',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.projects.projectDetails',
                        path: `${CONCEPTS_PREFIX_PATH}/projects/project-details/27`,
                        title: 'Details',
                        translateKey: 'nav.conceptsProjects.projectDetails',
                        icon: 'projectDetails',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProjects.projectDetailsDesc',
                                label: 'Project detailed information',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.projects.projectTasks',
                        path: `${CONCEPTS_PREFIX_PATH}/projects/tasks`,
                        title: 'Tasks',
                        translateKey: 'nav.conceptsProjects.projectTasks',
                        icon: 'projectTask',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProjects.projectTasksDesc',
                                label: 'Manage project tasks',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.projects.projectIssue',
                        path: `${CONCEPTS_PREFIX_PATH}/projects/tasks/1`,
                        title: 'Issue',
                        translateKey: 'nav.conceptsProjects.projectIssue',
                        icon: 'projectIssue',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsProjects.projectIssueDesc',
                                label: 'Resolve project issues',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.ai',
                path: '',
                title: 'AI',
                translateKey: 'nav.conceptsAi.ai',
                icon: 'ai',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAi.aiDesc',
                        label: 'AI tools and resources',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.ai.chat',
                        path: `${CONCEPTS_PREFIX_PATH}/ai/chat`,
                        title: 'Chat',
                        translateKey: 'nav.conceptsAi.chat',
                        icon: 'aiChat',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.conceptsAi.chatDesc',
                                label: 'AI-powered chat systems',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.ai.image',
                        path: `${CONCEPTS_PREFIX_PATH}/ai/image`,
                        title: 'Image',
                        translateKey: 'nav.conceptsAi.image',
                        icon: 'aiImage',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.conceptsAi.imageDesc',
                                label: 'AI image processing',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.account',
                path: '',
                title: 'Account',
                translateKey: 'nav.conceptsAccount.account',
                icon: 'account',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsAccount.accountDesc',
                        label: 'Account settings and info',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.account.settings',
                        path: `${CONCEPTS_PREFIX_PATH}/account/settings`,
                        title: 'Settings',
                        translateKey: 'nav.conceptsAccount.settings',
                        icon: 'accountSettings',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsAccount.settingsDesc',
                                label: 'Configure your settings',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.account.activityLog',
                        path: `${CONCEPTS_PREFIX_PATH}/account/activity-log`,
                        title: 'Activity log',
                        translateKey: 'nav.conceptsAccount.activityLog',
                        icon: 'accountActivityLogs',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsAccount.activityLogDesc',
                                label: 'View recent activities',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.account.rolesPermissions',
                        path: `${CONCEPTS_PREFIX_PATH}/account/roles-permissions`,
                        title: 'Roles & Permissions',
                        translateKey: 'nav.conceptsAccount.rolesPermissions',
                        icon: 'accountRoleAndPermission',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsAccount.rolesPermissionsDesc',
                                label: 'Manage roles & permissions',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.account.pricing',
                        path: `${CONCEPTS_PREFIX_PATH}/account/pricing`,
                        title: 'Pricing',
                        translateKey: 'nav.conceptsAccount.pricing',
                        icon: 'accountPricing',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey: 'nav.conceptsAccount.pricingDesc',
                                label: 'View pricing plans',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.helpCenter',
                path: '',
                title: 'Help Center',
                translateKey: 'nav.conceptsHelpCenter.helpCenter',
                icon: 'helpCenter',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.conceptsHelpCenter.helpCenterDesc',
                        label: 'Support and articles',
                    },
                },
                subMenu: [
                    {
                        key: 'concepts.helpCenter.supportHub',
                        path: `${CONCEPTS_PREFIX_PATH}/help-center/support-hub`,
                        title: 'Support Hub',
                        translateKey: 'nav.conceptsHelpCenter.supportHub',
                        icon: 'helpCeterSupportHub',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsHelpCenter.supportHubDesc',
                                label: 'Central support hub',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.helpCenter.article',
                        path: `${CONCEPTS_PREFIX_PATH}/help-center/article/pWBKE_0UiQ`,
                        title: 'Article',
                        translateKey: 'nav.conceptsHelpCenter.article',
                        icon: 'helpCeterArticle',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsHelpCenter.articleDesc',
                                label: 'Read support articles',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.helpCenter.editArticle',
                        path: `${CONCEPTS_PREFIX_PATH}/help-center/edit-article/pWBKE_0UiQ`,
                        title: 'Edit Article',
                        translateKey: 'nav.conceptsHelpCenter.editArticle',
                        icon: 'helpCeterEditArticle',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsHelpCenter.editArticleDesc',
                                label: 'Modify article content',
                            },
                        },
                        subMenu: [],
                    },
                    {
                        key: 'concepts.helpCenter.manageArticle',
                        path: `${CONCEPTS_PREFIX_PATH}/help-center/manage-article`,
                        title: 'Manage Article',
                        translateKey: 'nav.conceptsHelpCenter.manageArticle',
                        icon: 'helpCeterManageArticle',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsHelpCenter.manageArticleDesc',
                                label: 'Article management',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'concepts.calendar',
                path: `${CONCEPTS_PREFIX_PATH}/calendar`,
                title: 'Calendar',
                translateKey: 'nav.calendar',
                icon: 'calendar',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.calendarDesc',
                        label: 'Schedule and events',
                    },
                },
                subMenu: [],
            },

            {
                key: 'concepts.mail',
                path: `${CONCEPTS_PREFIX_PATH}/mail`,
                title: 'Mail',
                translateKey: 'nav.mail',
                icon: 'mail',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.mailDesc',
                        label: 'Manage your emails',
                    },
                },
                subMenu: [],
            },
            {
                key: 'concepts.chat',
                path: `${CONCEPTS_PREFIX_PATH}/chat`,
                title: 'Chat',
                translateKey: 'nav.chat',
                icon: 'chat',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                meta: {
                    description: {
                        translateKey: 'nav.chatDesc',
                        label: 'Chat with friends',
                    },
                },
                subMenu: [],
            },
        ],
    },
]

export default conceptsNavigationConfig
