import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import PodcastListActionTools from './components/PodcastListActionTools'
import PodcastListTableTools from './components/PodcastListTableTools'
import PodcastListTable from './components/PodcastListTable'
import PodcastListSelected from './components/PodcastListSelected'

const PodcastList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Podcasts</h3>
                            <PodcastListActionTools />
                        </div>
                        <PodcastListTableTools />
                        <PodcastListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <PodcastListSelected />
        </>
    )
}

export default PodcastList
