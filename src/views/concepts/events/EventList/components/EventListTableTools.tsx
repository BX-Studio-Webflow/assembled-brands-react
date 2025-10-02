import useCustomerList from '../hooks/useEventList'
import DebouceInput from '@/components/shared/DebouceInput'
// import EventListTableFilter from './EventListTableFilter'
import { TbSearch } from 'react-icons/tb'
import cloneDeep from 'lodash/cloneDeep'
import type { ChangeEvent } from 'react'

const EventListTableTools = () => {
    const { tableData, setTableData } = useCustomerList()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
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
            <DebouceInput
                placeholder="Search"
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
            {/* <EventListTableFilter /> */}
        </div>
    )
}

export default EventListTableTools
