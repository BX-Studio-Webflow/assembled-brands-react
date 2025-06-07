import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import usePodcastList from '../hooks/usePodcastList'
import { CSVLink } from 'react-csv'

const PodcastListActionTools = () => {
    const navigate = useNavigate()

    const { productList } = usePodcastList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink filename="product-list.csv" data={productList}>
                <Button icon={<TbCloudDownload className="text-xl" />}>
                    Export
                </Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/concepts/podcasts/podcast-create')}
            >
                Add podcasts
            </Button>
        </div>
    )
}

export default PodcastListActionTools
