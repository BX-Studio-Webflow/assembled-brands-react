export const formatDate = (date: Date, format: string): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return format
        .replace('DD', day)
        .replace(
            'MMM',
            new Date(date).toLocaleString('default', { month: 'short' }),
        )
        .replace('YYYY', year.toString())
        .replace('HH', hours)
        .replace('mm', minutes)
}
