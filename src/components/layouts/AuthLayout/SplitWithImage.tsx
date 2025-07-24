import { cloneElement } from 'react'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'
import { Avatar } from '@/components/ui'

interface SplitProps extends CommonProps {
    content?: ReactNode
    src: string | undefined
    title: string
    description: string
}

const SplitWithImage = ({ children, content, src, ...rest }: SplitProps) => {
    return (
        <div className="grid lg:grid-cols-2 h-full p-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col justify-center items-center bg-[#e0e0e0] rounded-3xl">
                <Avatar className="w-80 h-80" src={src} />
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-full px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default SplitWithImage
