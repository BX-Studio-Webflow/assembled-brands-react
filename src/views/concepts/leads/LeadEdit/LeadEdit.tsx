import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiDeleteLead,
    apiGetLead,
    apiUpdateLead,
} from '@/services/LeadsService'
import LeadForm from '../LeadForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import type { LeadFormSchema } from '../LeadForm'
import type { Lead } from '@/@types/lead'
import { useAuth } from '@/auth'
import { Card } from '@/components/ui/Card'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabList from '@/components/ui/Tabs/TabList'
import TabContent from '@/components/ui/Tabs/TabContent'
import { Tabs } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import isEmpty from 'lodash/isEmpty'
import { AxiosError } from 'axios'
import TagsSection from './TagsSection'
import LeadHeader from './LeadHeader'
import {
    HiChatAlt,
    HiPhone,
    HiCalendar,
    HiCheckCircle,
    HiPlusCircle,
} from 'react-icons/hi'

const LeadEdit = () => {
    const { id } = useParams()
    const { user } = useAuth()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/lead/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetLead<Lead>(params.id),
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
            revalidateOnReconnect: true,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    // Status computation logic
    const hasEvent = data?.event_id
    const hasCallback = data?.callback && Object.keys(data.callback).length > 0
    const attendedEvent = data?.attended_event

    let statusText = 'New lead'
    let statusIcon = (
        <HiPlusCircle className="text-base text-green-600 mr-1 rtl:ml-1" />
    )
    let statusClass =
        'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0'

    if (hasEvent && hasCallback) {
        statusText = 'Call Back'
        statusIcon = (
            <HiPhone className="text-base text-orange-600 mr-1 rtl:ml-1" />
        )
        statusClass =
            'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100 border-0'
    } else if (hasCallback) {
        statusText = 'Call Back'
        statusIcon = (
            <HiPhone className="text-base text-orange-600 mr-1 rtl:ml-1" />
        )
        statusClass =
            'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100 border-0'
    } else if (attendedEvent) {
        statusText = 'Attended event'
        statusIcon = (
            <HiCheckCircle className="text-base text-emerald-600 mr-1 rtl:ml-1" />
        )
        statusClass =
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'
    } else if (hasEvent) {
        statusText = 'Registered for event'
        statusIcon = (
            <HiCalendar className="text-base text-blue-600 mr-1 rtl:ml-1" />
        )
        statusClass =
            'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0'
    } else {
        statusText = 'New lead'
        statusIcon = (
            <HiPlusCircle className="text-base text-red-600 mr-1 rtl:ml-1" />
        )
        statusClass =
            'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 border-0'
    }

    const handleFormSubmit = async (values: LeadFormSchema) => {
        setIsSubmiting(true)
        try {
            const leadData = {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                dial_code: values.dialCode,
                phone: values.phoneNumber,
                host_id: user?.id || 0,
            }
            await apiUpdateLead(id as string, leadData)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">
                    Your changes have been saved!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/lead/lead-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const getDefaultValues = () => {
        if (data) {
            const [firstName, ...lastNameParts] = data.name.split(' ')
            const lastName = lastNameParts.join(' ')

            return {
                firstName,
                lastName,
                email: data.email,
                img: '',
                phoneNumber: data.phone,
                dialCode: data.dial_code || '00',
                country: '',
                address: '',
                city: '',
                postcode: '',
                tags: [],
                event_id: data.event_id,
            }
        }

        return {}
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteLead(id as string)
            toast.push(
                <Notification type="success">
                    Lead deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/concepts/lead/lead-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleChat = () => {
        navigate(`/concepts/mail`)
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <LeadHeader lead={data} />
                    <Loading loading={isLoading}>
                        {!isEmpty(data) && (
                            <div className="flex flex-col xl:flex-row gap-4">
                                <div className="w-full xl:w-1/2">
                                    <LeadForm
                                        defaultValues={
                                            getDefaultValues() as LeadFormSchema
                                        }
                                        newLead={false}
                                        statusText={statusText}
                                        statusIcon={statusIcon}
                                        statusClass={statusClass}
                                        onFormSubmit={handleFormSubmit}
                                    >
                                        <Container>
                                            <div className="flex flex-col sm:flex-row items-center justify-end px-4 sm:px-8 gap-4 sm:gap-0">
                                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                                                    <Button
                                                        block
                                                        className="w-full sm:w-auto"
                                                        type="button"
                                                        customColorClass={() =>
                                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                                        }
                                                        icon={<TbTrash />}
                                                        onClick={handleDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        block
                                                        type="button"
                                                        className="w-full sm:w-auto"
                                                        icon={<HiChatAlt />}
                                                        onClick={handleChat}
                                                    >
                                                        Message
                                                    </Button>
                                                    <Button
                                                        block
                                                        className="w-full sm:w-auto"
                                                        variant="solid"
                                                        type="submit"
                                                        loading={isSubmiting}
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        </Container>
                                    </LeadForm>
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <div className="flex flex-col gap-4">
                                        <Card className="w-full">
                                            <Tabs defaultValue="tags">
                                                <TabList>
                                                    <TabNav value="tags">
                                                        Tags
                                                    </TabNav>
                                                </TabList>
                                                <div className="p-4">
                                                    <TabContent value="tags">
                                                        <TagsSection
                                                            data={data}
                                                        />
                                                    </TabContent>
                                                </div>
                                            </Tabs>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Loading>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Delete lead"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to delete this lead? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default LeadEdit
