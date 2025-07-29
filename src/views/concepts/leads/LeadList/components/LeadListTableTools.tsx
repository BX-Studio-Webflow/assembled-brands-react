import useLeadList from '../hooks/useLeadList'
import LeadListSearch from './LeadListSearch'

import cloneDeep from 'lodash/cloneDeep'

const LeadsListTableTools = () => {
    const { tableData, setTableData } = useLeadList()

    const handleInputChange = (val: string) => {
        console.log('val', val)
        const newTableData = cloneDeep(tableData)
        newTableData.search = val
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
            <LeadListSearch onInputChange={handleInputChange} />
        </div>
    )
}

export default LeadsListTableTools
