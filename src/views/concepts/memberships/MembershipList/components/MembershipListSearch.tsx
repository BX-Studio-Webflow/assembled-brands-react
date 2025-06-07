import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import { Ref } from 'react'

type MembershipListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const MembershipListSearch = (props: MembershipListSearchProps) => {
    const { onInputChange, ref } = props

    return (
        <DebouceInput
            ref={ref}
            placeholder="Quick search..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default MembershipListSearch
