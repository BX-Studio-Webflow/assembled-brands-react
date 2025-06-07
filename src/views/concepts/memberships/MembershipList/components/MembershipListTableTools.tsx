import useMembershipList from '../hooks/useMembershipList'
import MembershipListSearch from './MembershipListSearch'
import MembershipTableFilter from './MembershipListTableFilter'
import cloneDeep from 'lodash/cloneDeep'

const MembershipsListTableTools = () => {
    const { tableData, setTableData } = useMembershipList()

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        if (typeof val === 'string' && val.length > 1) {
            setTableData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            setTableData(newTableData)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <MembershipListSearch onInputChange={handleInputChange} />
            <MembershipTableFilter />
        </div>
    )
}

export default MembershipsListTableTools
