import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import MembershipListTable from './components/MembershipListTable'
import MembershipListActionTools from './components/MembershipListActionTools'
import MembershipsListTableTools from './components/MembershipsListTableTools'
import MembershipListSelected from './components/MembershipListSelected'

const MembershipList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Memberships</h3>
                            <MembershipListActionTools />
                        </div>
                        <MembershipsListTableTools />
                        <MembershipListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <MembershipListSelected />
        </>
    )
}

export default MembershipList
