import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUsers } from 'react-icons/tb'
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
                icon={<TbUsers className="text-xl" />}
                onClick={() =>
                    navigate('/concepts/memberships/membership-create')
                }
            >
                Add new
            </Button>
        </div>
    )
}

export default MembershipListActionTools
