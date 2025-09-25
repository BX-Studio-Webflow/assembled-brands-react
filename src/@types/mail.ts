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

export type CreateBulkMailBody = {
    title: string
    content: string
    follow_up_who_gets_it: Array<'new_lead' | 'call_back' | 'registered_for_event' | 'attended_event'>
    timeline: number
    user_id: number
}

export type FollowUpEmail = {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: number;
    follow_up_who_gets_it: ("new_lead" | "call_back" | "registered_for_event" | "attended_event")[] | null;
    title: string;
    content: string;
    timeline: number;
    enabled: boolean | null;}