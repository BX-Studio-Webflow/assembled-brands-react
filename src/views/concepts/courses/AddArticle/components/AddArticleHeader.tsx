import { useState, useRef, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import uniqueId from 'lodash/uniqueId'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'
import type { Lesson } from '@/@types/course'

interface AddArticleHeaderProps {
    host: Lesson['host']
    title: string
    onTitleChange: (title: string) => void
}

export interface FieldProps extends CommonProps {
    title: string
    icon?: ReactNode
}

const Field = (props: FieldProps) => {
    const { title, icon, children } = props

    return (
        <div className="flex items-center mb-2">
            <div className="flex items-center gap-2 font-semibold min-w-[150px]">
                <span className="text-lg">{icon}</span>
                <span>{title}</span>
            </div>
            {children}
        </div>
    )
}

const AddArticleHeader = (props: AddArticleHeaderProps) => {
    const { host, title, onTitleChange } = props

    const [articleTags, setArticleTags] = useState<
        { id: string; label: string }[]
    >([])

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }, [articleTags])

    return (
        <div>
            <input
                className="ring-0 outline-hidden block w-full p-2 bg-transparent heading-text h3"
                placeholder="Untitled lesson"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />
            <div className="mt-3 flex flex-col gap-6 border-t border-gray-200 dark:border-gray-700 py-6">
                <Field title="Created by:">
                    <div className="flex items-center gap-2">
                        <Avatar size={25} src={host.profile_image} />
                        <span className="heading-text font-bold">
                            {host.name}
                        </span>
                    </div>
                </Field>
                <Field title="Last updated:">
                    <span className="heading-text font-bold">
                        {new Date().toLocaleDateString()}
                    </span>
                </Field>
                <Field title="Duration:">
                    <span className="heading-text font-bold">10 minutes</span>
                </Field>
                <Field title="Tags:">
                    <div className="flex flex-wrap items-center gap-2">
                        {articleTags.map((tag) => (
                            <Tag key={tag.id}>{tag.label}</Tag>
                        ))}
                        <input
                            ref={inputRef}
                            className="ring-0 outline-hidden block py-2 bg-transparent heading-text text-sm"
                            type="text"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    const eventTarget =
                                        event.target as HTMLInputElement
                                    setArticleTags((tag) => {
                                        const newTags = structuredClone(tag)

                                        newTags.push({
                                            id: uniqueId('article-tag-'),
                                            label: eventTarget.value,
                                        })
                                        return newTags
                                    })
                                    inputRef.current?.blur()
                                }

                                if (
                                    event.key === 'Backspace' &&
                                    (event.target as HTMLInputElement).value
                                        .length === 0
                                ) {
                                    setArticleTags((tag) => {
                                        const newTags = structuredClone(tag)
                                        newTags.pop()
                                        return newTags
                                    })
                                }
                            }}
                        />
                    </div>
                </Field>
            </div>
        </div>
    )
}

export default AddArticleHeader
