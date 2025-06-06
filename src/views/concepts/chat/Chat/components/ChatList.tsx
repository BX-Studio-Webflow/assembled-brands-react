import { useRef, useState, useEffect } from 'react'
import ChatSegment from './ChatSegment'
import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbSearch, TbX } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import ChatStats from './ChatStats'

const ChatList = () => {
    const chatsFetched = useChatStore((state) => state.chatsFetched)
    const setSelectedChatType = useChatStore(
        (state) => state.setSelectedChatType,
    )

    const inputRef = useRef<HTMLInputElement>(null)

    const [showSearchBar, setShowSearchBar] = useState(false)
    const [, setQueryText] = useState('')

    const { fetchChats } = useChat()

    useEffect(() => {
        if (!chatsFetched) {
            fetchChats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (showSearchBar) {
            inputRef.current?.focus()
        } else {
            inputRef.current?.blur()
        }
    }, [showSearchBar])

    function handleDebounceFn(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length > 0) {
            setSelectedChatType('')
        }

        if (e.target.value.length === 0) {
            setSelectedChatType('personal')
        }

        setQueryText(e.target.value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e)
    }

    const handleSearchToggleClick = () => {
        setShowSearchBar(!showSearchBar)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    {showSearchBar ? (
                        <input
                            ref={inputRef}
                            className="flex-1 h-full placeholder:text-gray-400 placeholder:text-base placeholder:font-normal bg-transparent focus:outline-hidden heading-text font-bold"
                            placeholder="Search chat"
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h4>Chat</h4>
                    )}
                    <button
                        className="close-button text-lg"
                        type="button"
                        onClick={handleSearchToggleClick}
                    >
                        {showSearchBar ? <TbX /> : <TbSearch />}
                    </button>
                </div>
                <ChatSegment />
            </div>
            <ChatStats
                data={{
                    visitors: 2000,
                    channels: [
                        {
                            id: '1',
                            name: 'Facebook',
                            img: 'https://www.facebook.com/favicon.ico',
                            total: 1000,
                            percentage: 50,
                        },
                        {
                            id: '2',
                            name: 'Facebook',
                            img: 'https://www.facebook.com/favicon.ico',
                            total: 1000,
                            percentage: 50,
                        },
                        {
                            id: '3',
                            name: 'Facebook',
                            img: 'https://www.facebook.com/favicon.ico',
                            total: 1000,
                            percentage: 50,
                        },
                        // You can add more channels here if needed
                    ],
                }}
            />
        </div>
    )
}

export default ChatList
