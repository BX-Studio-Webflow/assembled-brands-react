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
        title: 'Main menu',
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
                    {
                        key: 'concepts.customers.bulkCustomerCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/lead/bulk-lead-create`,
                        title: 'Import',
                        translateKey: 'nav.conceptsCustomers.bulkCustomerCreate',
                        icon: 'bulkCustomerCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsCustomers.bulkCustomerCreateDesc',
                                label: 'Import your leads',
                            },
                        },
                        subMenu: [],
                    },
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
                ],
            },
            /*{
                key: 'concepts.products',
                path: '',
                title: 'Podcasts',
                translateKey: 'nav.conceptsProducts.products',
                icon: 'podcast',
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
            },*/
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

            /*{
                key: 'concepts.memberships',
                path: '',
                title: 'Memberships',
                translateKey: 'nav.conceptsMemberships.memberships',
                icon: 'memberships',
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
                        key: 'concepts.memberships.membershipList',
                        path: `${CONCEPTS_PREFIX_PATH}/memberships/membership-list`,
                        title: 'Membership List',
                        translateKey: 'nav.conceptsMemberships.membershipList',
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
                        key: 'concepts.memberships.membershipCreate',
                        path: `${CONCEPTS_PREFIX_PATH}/memberships/membership-create`,
                        title: 'Membership Create',
                        translateKey:
                            'nav.conceptsMemberships.membershipCreate',
                        icon: 'productCreate',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, USER],
                        meta: {
                            description: {
                                translateKey:
                                    'nav.conceptsMemberships.membershipCreateDesc',
                                label: 'Add new membership',
                            },
                        },
                        subMenu: [],
                    },
                ],
            },*/
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
        ],
    },
]

export default conceptsNavigationConfig
