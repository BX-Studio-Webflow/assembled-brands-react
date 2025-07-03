import dashboardsRoute from './dashboardsRoute'
import conceptsRoute from './conceptsRoute'
import uiComponentsRoute from './uiComponentsRoute'
import authRoute from './authRoute'
import authDemoRoute from './authDemoRoute'
import guideRoute from './guideRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'
import onboardingRoute from './onboardingRoute'

// Split othersRoute - landing page goes to publicRoutes, others stay in openRoutes
const landingRoute = othersRoute.filter((route) => route.key === 'landing')
const otherOpenRoutes = othersRoute.filter((route) => route.key !== 'landing')

//only accessible when user is not logged in
export const publicRoutes: Routes = [...authRoute, ...landingRoute]

//only accessible when user is logged in
export const protectedRoutes: Routes = [
    ...dashboardsRoute,
    ...conceptsRoute,
    ...uiComponentsRoute,
    ...authDemoRoute,
    ...guideRoute,
    ...onboardingRoute,
]

//only accessible whether user is logged in or out
export const openRoutes: Routes = [...otherOpenRoutes]
