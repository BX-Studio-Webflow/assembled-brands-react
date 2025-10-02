import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import useEventList from '../hooks/useEventList'
import { CSVLink } from 'react-csv'

const EventListActionTools = () => {
    const navigate = useNavigate()

    const { EventList } = useEventList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/*<CSVLink
                className="w-full"
                filename="customerList.csv"
                data={EventList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Download
                </Button>
            </CSVLink>*/}
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/concepts/event/event-create')}
            >
                Add new
            </Button>
        </div>
    )
}

export default EventListActionTools
