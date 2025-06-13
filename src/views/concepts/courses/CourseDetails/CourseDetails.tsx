import { useState, lazy, Suspense, useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'
import ProjectDetailsHeader from './components/ProjectDetailsHeader'
import ProjectDetailsNavigation from './components/ProjectDetailsNavigation'
import useResponsive from '@/utils/hooks/useResponsive'
import useSWR from 'swr'
import { useParams } from 'react-router'
import type { GetProjectDetailsResponse } from './types'
import { apiGetCourse } from '@/services/CoursesService'

import Overview from './components/Overview'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const defaultNavValue = 'overview'
const settingsNavValue = 'settings'
const modulesNavValue = 'modules'

const Modules = lazy(() => import('./components/Modules'))
const Setting = lazy(() => import('./components/Setting'))

const CourseDetails = () => {
    const { id } = useParams()

    const { data, mutate } = useSWR(
        [`/course/${id}`],
         
        () => apiGetCourse(Number(id)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const action = urlParams.get('action')
        if (action === 'add-lesson' || action === 'added-lesson') {
            toast.push(
                <Notification type="success">
                    {action === 'add-lesson'
                        ? 'Great! Your course was just created. Time to add some lessons to your modules. Click the add lesson icon on a module to get started.'
                        : 'Great! Your lesson was just created. You can add more lessons to this module by clicking the add lesson icon on a module.'}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            setSelectedNav(modulesNavValue)
        }
    }, [])

    const { larger } = useResponsive()

    const [selectedNav, setSelectedNav] = useState(defaultNavValue)
    const [isContentEdit, setIsContentEdit] = useState(false)

    const handleEdit = (isEdit: boolean) => {
        setSelectedNav(settingsNavValue)
        setIsContentEdit(isEdit)
    }

    const handleContentChange = (content: string) => {
        mutate({ ...(data as GetProjectDetailsResponse), content }, false)
        setIsContentEdit(false)
    }

    const handleUpdate = ({
        name,
        content,
        dueDate,
    }: {
        name: string
        content: string
        dueDate: number
    }) => {
        const newData = { ...data }
        newData.name = name
        newData.content = content
        if (newData.schedule) {
            newData.schedule.dueDate = dueDate
        }

        mutate({ ...(newData as GetProjectDetailsResponse) }, false)
        setIsContentEdit(false)
        setSelectedNav(defaultNavValue)
    }

    const handleNavigationChange = (val: string) => {
        if (val === settingsNavValue) {
            setIsContentEdit(true)
        } else {
            setIsContentEdit(false)
        }
        setSelectedNav(val)
    }

    return (
        <div>
            {data && (
                <>
                    <ProjectDetailsHeader
                        title={data.name}
                        isContentEdit={isContentEdit}
                        selected={selectedNav}
                        onEdit={handleEdit}
                        onChange={handleNavigationChange}
                    />
                    <div className="mt-6 flex gap-12">
                        {larger.xl && (
                            <ProjectDetailsNavigation
                                selected={selectedNav}
                                onChange={handleNavigationChange}
                            />
                        )}
                        <div className="w-full">
                            <Suspense
                                fallback={
                                    <div className="my-4 mx-auto text-center flex justify-center">
                                        <Spinner size={40} />
                                    </div>
                                }
                            >
                                {selectedNav === defaultNavValue && (
                                    <Overview
                                        course={data}
                                        isContentEdit={isContentEdit}
                                        setIsContentEdit={setIsContentEdit}
                                        onContentChange={handleContentChange}
                                    />
                                )}
                                {selectedNav === 'modules' && (
                                    <Modules course={data} />
                                )}
                                {selectedNav === 'settings' && (
                                    <Setting
                                        course={data}
                                        onUpdate={handleUpdate}
                                    />
                                )}
                            </Suspense>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default CourseDetails
