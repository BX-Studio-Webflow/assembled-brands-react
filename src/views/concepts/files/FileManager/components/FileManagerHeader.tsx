import Segment from '@/components/ui/Segment'
import UploadFile from './UploadFile'
import { useFileManagerStore } from '../store/useFileManagerStore'
import { TbLayoutGrid, TbList } from 'react-icons/tb'
import type { Layout } from '../store/useFileManagerStore'

const FileManagerHeader = ({
    onUploadSuccess,
}: {
    onUploadSuccess?: () => void
}) => {
    const { layout, setLayout } = useFileManagerStore()

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3>File Manager</h3>
            </div>
            <div className="flex items-center gap-2">
                <Segment
                    value={layout}
                    onChange={(val) => setLayout(val as Layout)}
                >
                    <Segment.Item value="grid" className="text-xl px-3">
                        <TbLayoutGrid />
                    </Segment.Item>
                    <Segment.Item value="list" className="text-xl px-3">
                        <TbList />
                    </Segment.Item>
                </Segment>
                <UploadFile onUploadSuccess={onUploadSuccess} />
            </div>
        </div>
    )
}

export default FileManagerHeader
