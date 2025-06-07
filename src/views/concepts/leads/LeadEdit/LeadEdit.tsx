import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetLead, apiUpdateLead } from '@/services/LeadsService'
import LeadForm from '../LeadForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import type { LeadFormSchema } from '../LeadForm'
import type { Lead } from '@/@types/lead'
import { useAuth } from '@/auth'

const LeadEdit = () => {
    const { id } = useParams()
    const { user } = useAuth()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR(
        [`/lead/${id}`, { id: id as string }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetLead<Lead>(params.id),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: LeadFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        try {
            const leadData = {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                phone: `${values.dialCode}${values.phoneNumber}`,
                host_id: user?.id || 0,
            }
            await apiUpdateLead(id as string, leadData)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/lead/lead-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to update customer:{' '}
                    {error instanceof Error ? error.message : 'Unknown error'}
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
                dialCode: '',
                country: '',
                address: '',
                city: '',
                postcode: '',
                tags: [],
            }
        }

        return {}
    }

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(<Notification type="success">Lead deleted!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/customers/customer-list')
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
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
                    <LeadForm
                        defaultValues={getDefaultValues() as LeadFormSchema}
                        newLead={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
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
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remove customers"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to remove this customer? This
                            action can&apos;t be undo.{' '}
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default LeadEdit
