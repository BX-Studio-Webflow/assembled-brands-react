import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { Link } from 'react-router'
import {
    PiCalendarDuotone,
    PiPlusCircleDuotone,
    PiUserPlusDuotone,
} from 'react-icons/pi'
import { useAuth } from '@/auth'
import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'New Lead',
        path: '/concepts/lead/lead-create',
        icon: <PiUserPlusDuotone />,
    },
    {
        label: 'New Event',
        path: '/concepts/event/event-create',
        icon: <PiCalendarDuotone />,
    },
]

const _UserResourceDropdown = () => {
    useAuth()

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <PiPlusCircleDuotone size={32} />
                </div>
            }
            placement="bottom-end"
        >
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const UserResourceDropdown = withHeaderItem(_UserResourceDropdown)

export default UserResourceDropdown
