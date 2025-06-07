import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import useMembershipList from '../hooks/useMembershipList'
import { CSVLink } from 'react-csv'

const MembershipListActionTools = () => {
    const navigate = useNavigate()

    const { customerList } = useMembershipList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="customerList.csv"
                data={customerList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Download
                </Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => navigate('/concepts/lead/lead-create')}
            >
                Add new
            </Button>
        </div>
    )
}

export default MembershipListActionTools
