import { useMemo } from 'react'
import Dropdown from '@/components/ui/Dropdown'
import { TbFilter, TbCheck } from 'react-icons/tb'

type LogActionProps = {
    selectedType: string[]
    onFilterChange: (item: string) => void
}

const filterItems = [
    { label: 'New Booking', value: 'new_booking' },
    { label: 'New Lead', value: 'new_lead' },
    { label: 'New Event', value: 'new_event' },
    { label: 'New Payment', value: 'new_payment' },
    { label: 'New Membership', value: 'new_membership' },
    { label: 'System', value: 'system' },
    { label: 'Reminder', value: 'reminder' },
]

const LogAction = ({ selectedType = [], onFilterChange }: LogActionProps) => {
    const allUnchecked = useMemo(() => {
        return !selectedType.some((type) =>
            filterItems.map((item) => item.value).includes(type),
        )
    }, [selectedType])

    return (
        <div className="flex items-center justify-between gap-4">
            <Dropdown
                placement="bottom-end"
                renderTitle={
                    <button
                        className="close-button p-2.5! button-press-feedback"
                        type="button"
                    >
                        <TbFilter />
                    </button>
                }
            >
                {filterItems.map((item) => (
                    <Dropdown.Item
                        key={item.value}
                        eventKey={item.value}
                        onClick={() => onFilterChange(item.value)}
                    >
                        {!allUnchecked && (
                            <div className="flex justify-center w-[20px]">
                                {selectedType.includes(item.value) && (
                                    <TbCheck className="text-primary text-lg" />
                                )}
                            </div>
                        )}
                        <span>{item.label}</span>
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </div>
    )
}

export default LogAction
