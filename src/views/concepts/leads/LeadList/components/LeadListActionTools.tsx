import Button from '@/components/ui/Button'
import { TbCloudDownload, TbCloudUpload, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import useLeadList from '../hooks/useLeadList'
import { CSVLink } from 'react-csv'

const LeadListActionTools = () => {
    const navigate = useNavigate()

    const { leadList } = useLeadList()
    const exportedLeadList = leadList.map((lead) => ({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        dial_code: lead.dial_code,
    }))
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="leadList.csv"
                data={exportedLeadList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Export
                </Button>
            </CSVLink>

            <Button
                icon={<TbCloudUpload className="text-xl" />}
                className="w-full"
                onClick={() => navigate('/concepts/lead/bulk-lead-create')}
            >
                Import
            </Button>

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

export default LeadListActionTools
