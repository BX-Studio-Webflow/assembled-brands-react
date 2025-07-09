import { apiGetEvents } from '@/services/EventService'
import { apiGetTags } from '@/services/LeadsService'
import MailBody from './components/MailBody'
import MailEditor from './components/MailEditor'
import useSWR from 'swr'

const Mail = () => {
    //useSWR to fetch the events and tags
    const { data: events } = useSWR('/event', () => apiGetEvents())
    const { data: tags } = useSWR('/tags', () => apiGetTags())
    console.log('events', events)
    console.log('tags', tags)

    // Transform events to match the expected Event interface
    const transformedEvents =
        events?.events?.map((eventWithDetails) => ({
            id: eventWithDetails.event.id,
            event_name: eventWithDetails.event.event_name,
            event_description: eventWithDetails.event.event_description,
            event_type: eventWithDetails.event.event_type,
            asset_id: eventWithDetails.event.asset_id,
            created_at: eventWithDetails.event.created_at,
            status: eventWithDetails.event.status,
            live_video_url: eventWithDetails.event.live_video_url,
            success_url: eventWithDetails.event.success_url,
            instructions: eventWithDetails.event.instructions,
            landing_page_url: eventWithDetails.event.landing_page_url,
            calendar_url: eventWithDetails.event.calendar_url,
            live_venue_address: eventWithDetails.event.live_venue_address,
            updated_at: eventWithDetails.event.updated_at,
            host_id: eventWithDetails.event.host_id,
        })) || []

    // Transform tags to match the expected Tag interface
    const transformedTags =
        tags?.map((tag) => ({
            id: Number(tag.id),
            host_id: tag.host_id,
            tag: tag.name, // Map 'name' to 'tag'
            created_at: tag.created_at || new Date().toISOString(),
            updated_at: tag.updated_at || new Date().toISOString(),
        })) || []

    return (
        <>
            <MailBody />
            <MailEditor events={transformedEvents} tags={transformedTags} />
        </>
    )
}

export default Mail
