import IconText from '@/components/shared/IconText'
import Avatar from '@/components/ui/Avatar'
import ScrollBar from '@/components/ui/ScrollBar'
import ReactHtmlParser from 'html-react-parser'
import { HiOutlineClock } from 'react-icons/hi'
import type { GetMailResponse } from '../types'
import type { ScrollBarRef } from '@/components/ui/ScrollBar'
import type { PropsWithChildren, Ref } from 'react'

type MailDetailContentProps = PropsWithChildren<{
    mail?: Partial<GetMailResponse>
    ref?: Ref<ScrollBarRef>
}>

const MailDetailContent = (props: MailDetailContentProps) => {
    const { mail = {}, ref } = props

    return (
        <div className="absolute top-0 left-0 h-full w-full">
            <ScrollBar
                ref={ref}
                autoHide
                className="overflow-y-auto h-[calc(100%-100px)]"
            >
                <div className="h-full px-6">
                    <div className="py-8 ltr:pr-4 rtl:pl-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    shape="circle"
                                    src={`https://ui-avatars.com/api/?name=${mail.email}&background=random`}
                                />
                                <div>
                                    <div className="font-bold truncate heading-text">
                                        {mail.email}
                                    </div>
                                    <div>Subject: {mail.subject}</div>
                                </div>
                            </div>
                            <IconText
                                icon={<HiOutlineClock className="text-lg" />}
                            >
                                <span className="font-semibold">
                                    {new Date(
                                        mail.created_at || '',
                                    ).toLocaleString()}
                                </span>
                            </IconText>
                        </div>
                        <div className="mt-8">
                            {ReactHtmlParser(mail.body || '')}
                        </div>
                        {mail.button_text && mail.button_link && (
                            <div className="mt-6">
                                <a
                                    href={mail.button_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {mail.button_text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollBar>
        </div>
    )
}

export default MailDetailContent
