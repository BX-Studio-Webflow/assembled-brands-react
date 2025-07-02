import Avatar from '@/components/ui/Avatar'
import Attachment from './Attachment'
import classNames from '@/utils/classNames'
import type { ReactNode } from 'react'

export type MessageProps = {
    id: string
    sender: {
        id: string
        name: string
        avatarImageUrl?: string
    }
    content?: string | ReactNode
    timestamp?: Date | number
    type: 'regular' | 'reply' | 'deleted' | 'divider'
    attachments?: Array<{
        type: 'image' | 'video' | 'audio' | 'misc'
        source: File
        mediaUrl: string
    }>
    showAvatar?: boolean
    isMyMessage?: boolean
    avatarGap?: boolean
    bubbleClass?: string
    customRenderer?: () => string | ReactNode
    customAction?: () => string | ReactNode
}

const Message = (props: MessageProps) => {
    const {
        attachments,
        content,
        showAvatar = true,
        avatarGap,
        isMyMessage,
        sender,
        type,
        timestamp,
        customRenderer,
        customAction,
        bubbleClass,
    } = props

    const formatTimestamp = (timestamp?: Date | number) => {
        if (!timestamp) return null

        const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString()
        const isYesterday =
            new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
            date.toDateString()

        if (isToday) {
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            })
        } else if (isYesterday) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        } else {
            return date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        }
    }

    return (
        <>
            {type === 'divider' ? (
                <></>
            ) : (
                <div
                    className={classNames('flex', isMyMessage && 'justify-end')}
                >
                    <div className="flex flex-col">
                        <div
                            className={classNames(
                                'inline-flex items-end gap-2',
                                isMyMessage && 'justify-end flex-row-reverse',
                            )}
                        >
                            {showAvatar && (
                                <div className={classNames('w-[35px]')}>
                                    {avatarGap && (
                                        <Avatar
                                            src={sender.avatarImageUrl}
                                            size={35}
                                        />
                                    )}
                                </div>
                            )}
                            <div
                                className={classNames(
                                    'bubble flex flex-col justify-center h-full max-w-[750px] rounded-xl px-5 py-2.5 prose text-sm',
                                    isMyMessage
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                                    bubbleClass,
                                )}
                            >
                                {customRenderer ? (
                                    customRenderer()
                                ) : (
                                    <>
                                        {!isMyMessage && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                                                {sender.name}
                                            </div>
                                        )}
                                        {attachments &&
                                            attachments?.length > 0 && (
                                                <Attachment
                                                    attachments={attachments}
                                                />
                                            )}
                                        {content}
                                    </>
                                )}
                            </div>
                        </div>
                        {timestamp && (
                            <div
                                className={classNames(
                                    'flex items-center gap-2 mt-1',
                                    isMyMessage && 'justify-end',
                                )}
                            >
                                {showAvatar && avatarGap && (
                                    <div
                                        className={classNames('w-[35px]')}
                                    ></div>
                                )}
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatTimestamp(timestamp)}
                                </div>
                            </div>
                        )}
                        {customAction && (
                            <div>
                                <div
                                    className={classNames(
                                        'flex items-end gap-2',
                                        isMyMessage && ' flex-row-reverse',
                                    )}
                                >
                                    {showAvatar && avatarGap && (
                                        <div
                                            className={classNames('w-[35px]')}
                                        ></div>
                                    )}
                                    {customAction()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Message
