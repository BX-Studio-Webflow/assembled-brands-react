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
                path: 'installation',
                label: 'Installation',
                component: lazy(() => import('./components/Installation')),
            },
            {
                path: 'tailwindcss',
                label: 'TailwindCSS',
                component: lazy(() => import('./components/TailwindCss')),
            },
            {
                path: 'css',
                label: 'CSS',
                component: lazy(() => import('./components/Css')),
            },
            {
                path: 'starter',
                label: 'Starter',
                component: lazy(() => import('./components/Starter')),
            },
            {
                path: 'updating',
                label: 'Updating',
                component: lazy(() => import('./components/Updating')),
            },
        ],
    },
    {
        groupName: 'Development',
        nav: [
            {
                path: 'development-server',
                label: 'Development Server',
                component: lazy(() => import('./components/DevelopmentServer')),
            },
            {
                path: 'folder-structure',
                label: 'Folder Structure',
                component: lazy(() => import('./components/FolderStructure')),
            },
            {
                path: 'routing',
                label: 'Routing',
                component: lazy(() => import('./components/Routing')),
            },
            {
                path: 'stateManagement',
                label: 'State management',
                component: lazy(() => import('./components/StateManagement')),
            },
            {
                path: 'api-integration',
                label: 'API Integration',
                component: lazy(() => import('./components/ApiIntegration')),
            },
            {
                path: 'authentication',
                label: 'Authentication',
                component: lazy(() => import('./components/Authentication')),
            },
            {
                path: 'mock-api',
                label: 'Mock Api',
                component: lazy(() => import('./components/MockApi')),
            },
            {
                path: 'firebase',
                label: 'Firebase',
                component: lazy(
                    () => import('./components/FirebaseIntegration'),
                ),
            },
        ],
    },
]

export default documentationRoutes
