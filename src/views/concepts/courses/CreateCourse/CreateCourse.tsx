import useSWR from 'swr'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { apiGetAssets } from '@/services/AssetService'
import Setting from './components/Setting'

const CreateCourse = () => {
    const { data: assetsData } = useSWR(
        '/asset',

        () => apiGetAssets(),
        {
            revalidateOnFocus: false,
        },
    )

    return (
        <AdaptiveCard>
            <Setting assets={assetsData?.assets || []} />
        </AdaptiveCard>
    )
}

export default CreateCourse
