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
import { HiChatAlt } from 'react-icons/hi'

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
                                        onFormSubmit={handleFormSubmit}
                                    >
                                        <Container>
                                            <div className="flex items-center justify-end px-8">
                                                <div className="flex items-center">
                                                    <Button
                                                        className="ltr:mr-3 rtl:ml-3"
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
                                                        className="ltr:mr-3 rtl:ml-3"
                                                        variant="solid"
                                                        type="submit"
                                                        loading={isSubmiting}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        className="ltr:mr-3 rtl:ml-3"
                                                        icon={<HiChatAlt />}
                                                        onClick={handleChat}
                                                    />
                                                </div>
                                            </div>
                                        </Container>
                                    </LeadForm>
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <div className="flex flex-col gap-4">
                                        <Card className="w-full">
                                            <Tabs defaultValue="billing">
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
