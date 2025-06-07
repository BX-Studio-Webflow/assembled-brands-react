import PodcastListSearch from './PodcastListSearch'
import PodcastTableFilter from './PodcastTableFilter'
import useProducList from '../hooks/usePodcastList'
import cloneDeep from 'lodash/cloneDeep'

const ProducListTableTools = () => {
    const { tableData, setTableData } = useProducList()

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
            <PodcastListSearch onInputChange={handleInputChange} />
            <PodcastTableFilter />
        </div>
    )
}

export default ProducListTableTools
