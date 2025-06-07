import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import LeadListTable from './components/LeadListTable'
import LeadListActionTools from './components/LeadListActionTools'
import LeadListTableTools from './components/LeadListTableTools'
import LeadListSelected from './components/LeadListSelected'

const LeadList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Leads</h3>
                            <LeadListActionTools />
                        </div>
                        <LeadListTableTools />
                        <LeadListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <LeadListSelected />
        </>
    )
}

export default LeadList
