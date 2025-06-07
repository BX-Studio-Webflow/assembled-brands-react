import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import EventListTable from './components/EventListTable'
import EventListActionTools from './components/EventListActionTools'
import EventListTableTools from './components/EventListTableTools'

const EventList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Events</h3>
                        <EventListActionTools />
                    </div>
                    <EventListTableTools />
                    <EventListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default EventList
