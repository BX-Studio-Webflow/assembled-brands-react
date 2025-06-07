import useSWR from 'swr'
import { usePodcastListStore } from '../store/podcastListStore'
import { apiGetPodcasts } from '@/services/PodcastService'
import type { GetPodcastsResponse } from '@/@types/podcast'

const usePodcastList = () => {
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedPodcast,
        setSelectedPodcast,
        setSelectAllPodcast,
    } = usePodcastListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/podcast', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetPodcasts(params),
        {
            revalidateOnFocus: false,
        },
    )

    const transformedPodcasts =
        data?.podcasts?.map((podcast: GetPodcastsResponse['podcasts'][0]) => ({
            id: podcast.podcast.id.toString(),
            name: podcast.podcast.title,
            productCode: `POD-${podcast.podcast.id}`,
            img: podcast.cover.asset_url,
            price: podcast.memberships[0]?.price || 0,
            stock: 1,
            sales: 0,
            salesPercentage: 0,
            status: podcast.podcast.status,
            description: podcast.podcast.description,
            type: podcast.podcast.podcast_type,
            episodeType: podcast.podcast.episode_type,
            host: podcast.host.name,
            membershipNames: podcast.memberships.map((m) => m.name).join(', '),
            createdAt: podcast.podcast.created_at,
        })) || []

    const productList = transformedPodcasts
    const productListTotal = data?.total || 0

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        productList,
        productListTotal,
        setTableData,
        selectedPodcast,
        setSelectedPodcast,
        setSelectAllPodcast,
        setFilterData,
    }
}

export default usePodcastList
