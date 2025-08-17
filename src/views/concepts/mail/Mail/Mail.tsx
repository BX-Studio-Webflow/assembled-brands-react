import { apiGetEvents } from '@/services/EventService'
import { apiGetTags } from '@/services/LeadsService'
import MailBody from './components/MailBody'
import MailEditor from './components/MailEditor'
import useSWR from 'swr'

const Mail = () => {
    //useSWR to fetch the events and tags
    const { data: eventsData } = useSWR('/event', () => apiGetEvents())
    const { data: tags } = useSWR('/tags', () => apiGetTags())

    // Use events directly with proper types
    const events = eventsData?.events || []

    // Transform tags to match the expected Tag interface
    const transformedTags =
        tags
            ?.map((tag) => ({
                id: Number(tag.id),
                host_id: tag.host_id,
                tag: tag.tag, // Map 'name' to 'tag'
                created_at: tag.created_at || new Date().toISOString(),
                updated_at: tag.updated_at || new Date().toISOString(),
            }))
            .filter(
                (tag, index, self) =>
                    index === self.findIndex((t) => t.tag === tag.tag),
            ) || []

    return (
        <>
            <MailBody />
            <MailEditor events={events} tags={transformedTags} />
        </>
    )
}

export default Mail
