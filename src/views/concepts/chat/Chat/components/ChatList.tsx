import { useRef, useState, useEffect } from 'react'
import ChatSegment from './ChatSegment'
import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbExternalLink, TbMail, TbSearch, TbX } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import ChatStats from './ChatStats'
import { Link, useSearchParams } from 'react-router'
import { Avatar, Card } from '@/components/ui'
import { IconText } from '@/components/shared'
import { EventStreamResponse } from '@/@types/events'

interface ChatListProps {
    event: EventStreamResponse
}

const ChatList = ({ event }: ChatListProps) => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    const chatsFetched = useChatStore((state) => state.chatsFetched)
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    console.log(event)
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
            setSelectedChat({})
        }

        if (e.target.value.length === 0) {
            setSelectedChat({})
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
            {token && email && code ? (
                <Card>
                    <h4 className="mb-4">Host</h4>
                    {event?.event?.host && (
                        <Link
                            className="group flex items-center justify-between"
                            to="/concepts/customers/customer-details/11"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar
                                    shape="circle"
                                    src={event.event.host.profile_image || ''}
                                />
                                <div>
                                    <div className="font-bold heading-text">
                                        {event.event.host.name || ''}
                                    </div>
                                    <span>
                                        <span className="font-semibold">
                                            {event.event.host.email || ''}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <TbExternalLink className="text-xl hidden group-hover:block" />
                        </Link>
                    )}
                    <hr className="my-5" />
                    {event?.event?.host && (
                        <IconText
                            className="mb-4"
                            icon={<TbMail className="text-xl opacity-70" />}
                        >
                            <span>{event.event.host.email || ''}</span>
                        </IconText>
                    )}
                </Card>
            ) : (
                <ChatStats
                    data={{
                        visitors: 2000,
                        channels: [
                            {
                                id: '1',
                                name: 'Facebook',
                                percentage: 50,
                                total: 1000,
                                img: 'https://www.facebook.com/favicon.ico',
                            },
                            {
                                id: '2',
                                name: 'Facebook',
                                percentage: 50,
                                total: 1000,
                                img: 'https://www.facebook.com/favicon.ico',
                            },
                            {
                                id: '3',
                                name: 'Facebook',
                                percentage: 50,
                                total: 1000,
                                img: 'https://www.facebook.com/favicon.ico',
                            },
                        ],
                    }}
                />
            )}
        </div>
    )
}

export default ChatList
