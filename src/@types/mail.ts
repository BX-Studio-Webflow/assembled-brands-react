export interface MailRequestBody {
    subject: string
    title: string
    subtitle: string
    body: string
    button_text: string
    type: string
    button_link: string
    recipients: number[]
}
export interface MailSearchRequestBody {
    search_by: 'name' | 'tag' | 'event'
    search_value: string
}
