export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/user/login',
    signOut: '/user/logout',
    signUp: '/user/register',
    forgotPassword: '/user/request-reset-password',
    resetPassword: '/user/reset-password',
    saveBusinessDetails: '/business/my',
    updateSettingsNotification: '/user/notification-settings',
}

export default endpointConfig
