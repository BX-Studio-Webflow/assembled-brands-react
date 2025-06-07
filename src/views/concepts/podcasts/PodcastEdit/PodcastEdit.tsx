import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import { apiGetPodcast } from '@/services/PodcastService'
import type { PodcastDetails } from '@/@types/podcast'
import type { PodcastFormSchema } from '../PodcastForm/types'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PodcastForm from '../PodcastForm'
import NoProductFound from '@/assets/svg/NoProductFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import sleep from '@/utils/sleep'

const PodcastEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const podcastId = id ? parseInt(id, 10) : 0

    const { data, isLoading } = useSWR<PodcastDetails>(
        podcastId ? [`/api/podcast/${podcastId}`, podcastId] : null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, id]) => apiGetPodcast(id as number),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getDefaultValues = (): PodcastFormSchema | undefined => {
        if (data) {
            const { podcast, memberships } = data

            return {
                name: podcast.title,
                description: podcast.description,
                podcast_type: podcast.podcast_type,
                episode_type: podcast.episode_type,
                cover_image_asset_id: podcast.cover_image_asset_id,
                podcast_url: podcast.link_url,
                landing_page_url: podcast.landing_page_url,
                membership_plans: memberships.map((m) => m.id),
            }
        }
        return undefined
    }

    const handleFormSubmit = async (values: PodcastFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmitting(true)
        await sleep(800)
        setIsSubmitting(false)
        toast.push(<Notification type="success">Changes Saved!</Notification>, {
            placement: 'top-center',
        })
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(false)
        toast.push(
            <Notification type="success">Podcast Deleted!</Notification>,
            {
                placement: 'top-center',
            },
        )
        navigate('/concepts/podcasts/podcast-list')
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoProductFound height={280} width={280} />
                    <h3 className="mt-8">No product found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <Container>
                        <AdaptiveCard>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <h3>Edit Podcast</h3>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="plain"
                                            icon={<TbArrowNarrowLeft />}
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="plain"
                                            icon={<TbTrash />}
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <PodcastForm
                                    defaultValues={getDefaultValues()}
                                    newPodcast={false}
                                    onFormSubmit={handleFormSubmit}
                                >
                                    <div className="flex items-center justify-between px-8">
                                        <Button
                                            variant="solid"
                                            type="submit"
                                            loading={isSubmitting}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </PodcastForm>
                            </div>
                        </AdaptiveCard>
                    </Container>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Delete podcast"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to delete this podcast? This
                            action can&apos;t be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default PodcastEdit
