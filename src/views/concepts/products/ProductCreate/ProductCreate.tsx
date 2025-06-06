import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ProductForm from '../ProductForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import type { PodcastFormSchema } from '../ProductForm/types'
import { apiCreatePodcast } from '@/services/PodcastService'
import { AxiosError } from 'axios'

const ProductCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: PodcastFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        try {
            const payload = {
                title: values.name,
                description: values.description,
                cover_image_asset_id: values.cover_image_asset_id || 0,
                podcast_type: values.podcast_type,
                episode_type:
                    values.episode_type === 'series' ? 'multiple' : 'single',
                status: 'published',
                link_url: values.podcast_url || '',
                landing_page_url: values.landing_page_url || '',
                assets: Array.isArray(values.asset)
                    ? values.asset
                    : values.asset
                      ? [values.asset]
                      : [],
                memberships: values.membership_plans,
            }
            await apiCreatePodcast(payload)
            navigate('/concepts/podcasts/podcast-list')
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">Event created!</Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/podcasts/podcast-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
        setIsSubmiting(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Product discardd!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/products/product-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <ProductForm
                newProduct
                defaultValues={{
                    name: '',
                    description: '',
                    membership_plans: [],
                    landing_page_url: '',
                    cover_image_asset_id: undefined,
                    episode_type: 'series',
                    podcast_type: 'prerecorded',
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </ProductForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductCreate
