export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            const parts = result.split(',')
            resolve(parts.length > 1 ? parts[1] : parts[0])
        }
        reader.onerror = () => reject(new Error('Failed to read file as base64'))
        reader.readAsDataURL(file)
    })
}
