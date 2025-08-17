export interface MailRequestBody {
    subject: string
    title: string
    subtitle: string
    body: string
    button_text: string
    type: string
    filterType?: 'everyone' | 'attended' | 'notAttended'
    button_link: string
    recipients: number[]
    selectedMembership?: number
}
export interface MailSearchRequestBody {
    search_by: 'name' | 'tag' | 'event'
    search_value: string
}

export interface MailCreateResponse {
    count: number
    [key: string]: unknown
}
