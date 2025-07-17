import { cloneElement } from 'react'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'

interface SplitProps extends CommonProps {
    content?: ReactNode
    src: string
    title: string
    description: string
}

const Split = ({ children, content, src, ...rest }: SplitProps) => {
    return (
        <div className="grid lg:grid-cols-2 h-full p-6 bg-white dark:bg-gray-800">
            <div
                className="bg-no-repeat bg-cover bg-center py-6 px-16 flex-col justify-center items-center hidden lg:flex bg-primary rounded-3xl"
                style={{
                    backgroundImage: `url(${src || '/img/others/auth-split-img.png'})`,
                }}
            ></div>
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

export default Split
