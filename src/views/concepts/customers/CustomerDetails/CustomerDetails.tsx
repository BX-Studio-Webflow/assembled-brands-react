import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import ProfileSection from './ProfileSection'
import BillingSection from './BillingSection'
import ActivitySection from './ActivitySection'
import useSWR from 'swr'
import { useParams } from 'react-router'
import isEmpty from 'lodash/isEmpty'
import { apiGetLead } from '@/services/LeadsService'
import { Lead } from '@/@types/lead'

const { TabNav, TabList, TabContent } = Tabs

const CustomerDetails = () => {
    const { id } = useParams()

    const { data, isLoading } = useSWR(
        ['/lead/${id}', { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetLead<Lead>(params.id),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {!isEmpty(data) && (
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="min-w-[330px] 2xl:min-w-[400px]">
                        <ProfileSection
                            data={{
                                id: data.id.toString() || '',
                                name: data.name || '',
                                email: data.email || '',
                                lastOnline: 0,
                                personalInfo: {
                                    location: 'United States',
                                    title: '',
                                    birthday: '01/02/1970',
                                    phoneNumber: data.phone || '',
                                    facebook: '',
                                    twitter: '',
                                    pinterest: '',
                                    linkedIn: '',
                                },
                            }}
                        />
                    </div>
                    <Card className="w-full">
                        <Tabs defaultValue="billing">
                            <TabList>
                                <TabNav value="billing">Billing</TabNav>
                                <TabNav value="activity">Activity</TabNav>
                            </TabList>
                            <div className="p-4">
                                <TabContent value="billing">
                                    <BillingSection
                                        data={{
                                            ...data,
                                            orderHistory: [
                                                {
                                                    id: '1',
                                                    item: 'Premium Plan',
                                                    status: 'Completed',
                                                    amount: 99.99,
                                                    date: Date.now(),
                                                },
                                            ],
                                            personalInfo: {
                                                address: '123 Main St',
                                                postcode: '12345',
                                                city: 'New York',
                                                country: 'USA',
                                            },
                                            paymentMethod: [
                                                {
                                                    cardHolderName: data.name,
                                                    cardType: 'Visa',
                                                    expMonth: '12',
                                                    expYear: '2025',
                                                    last4Number: '4242',
                                                    primary: true,
                                                },
                                            ],
                                        }}
                                    />
                                </TabContent>
                                <TabContent value="activity">
                                    <ActivitySection
                                        customerName={data.name}
                                        id={id as string}
                                    />
                                </TabContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>
            )}
        </Loading>
    )
}

export default CustomerDetails
