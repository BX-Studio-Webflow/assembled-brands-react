export const apiUpdateBusiness = (data: {
    name: string
    address: string
    email: string
    dial_code: string
    phone: string
}) => {
    return ApiService.fetchDataWithAxios<void>({
        url: '/business/my',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
