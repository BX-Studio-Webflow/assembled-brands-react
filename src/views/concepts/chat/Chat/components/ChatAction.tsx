import { useRef } from 'react'
import Dropdown from '@/components/ui/Dropdown'
import { TbDotsVertical, TbBell, TbBellOff, TbShare3 } from 'react-icons/tb'
import type { DropdownRef } from '@/components/ui/Dropdown'

type ChatActionProps = {
    muted?: boolean
}

const ChatAction = ({ muted }: ChatActionProps) => {
    const dropdownRef = useRef<DropdownRef>(null)

    return (
        <div className="flex items-center gap-2">
            <Dropdown
                ref={dropdownRef}
                placement="bottom-end"
                renderTitle={
                    <button className="outline-hidden rounded-full p-2 text-xl bg-white dark:bg-gray-500 hover:bg-gray-200 dark:hover:bg-gray-400 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-100">
                        <TbDotsVertical />
                    </button>
                }
            >
                <Dropdown.Item eventKey="mute">
                    <span className="text-lg">
                        {muted ? <TbBellOff /> : <TbBell />}
                    </span>
                    <span>{muted ? 'Unmute' : 'Mute'}</span>
                </Dropdown.Item>
                <Dropdown.Item eventKey="shareContact">
                    <span className="text-lg">
                        <TbShare3 />
                    </span>
                    <span>Share contact</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default ChatAction
