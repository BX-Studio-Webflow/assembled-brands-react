import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import AttributeSection from './components/AttributeSection'
import { useForm, Control } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { PodcastFormSchema } from './types'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import useSWR from 'swr'
import type { Asset, AssetQueryParams } from '@/@types/asset'
import { apiGetAssets } from '@/services/AssetService'
import { apiGetMemberships } from '@/services/MembershipService'
import type { Membership, MembershipQueryParams } from '@/@types/membership'

// Default membership plan logic (similar to OrderForm)

const validationSchema: ZodType<PodcastFormSchema> = z.object({
    episode_type: z
        .string()
        .min(1, { message: 'Please select series or episode.' }),
    name: z.string().min(1, { message: 'Name required!' }),
    description: z.string().min(1, { message: 'Description required!' }),
    podcast_type: z.string().min(1, { message: 'Please select podcast type.' }),
    asset: z.union([z.number(), z.array(z.number())]).optional(),
    podcast_url: z.string().url({ message: 'Must be a valid URL' }).optional(),
    landing_page_url: z.string().url({ message: 'Must be a valid URL' }),
    cover_image_asset_id: z.number({
        required_error: 'Cover image is required',
    }),
    membership_plans: z
        .array(z.number())
        .min(1, { message: 'At least 1 membership plan required!' }),
})

type ProductFormProps = {
    onFormSubmit: (values: PodcastFormSchema) => void
    defaultValues?: PodcastFormSchema
    newProduct?: boolean
} & CommonProps

const ProductForm = (props: ProductFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {
            episode_type: 'series',
            podcast_type: 'prerecorded',
            name: '',
            description: '',
            membership_plans: [],
            landing_page_url: '',
            cover_image_asset_id: undefined,
        },
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<PodcastFormSchema>({
        defaultValues: defaultValues as PodcastFormSchema,
        resolver: zodResolver(validationSchema),
    })

    const [assets, setAssets] = useState<Asset[]>([])
    const [memberships, setMemberships] = useState<Membership[]>([])

    useSWR(
        [
            '/asset',
            {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                sort: {
                    order: '',
                    key: '',
                },
            } as AssetQueryParams,
        ],
        (_: string, params: AssetQueryParams) => apiGetAssets(params),
        {
            revalidateOnFocus: false,
            onSuccess: (response) => {
                setAssets(response.assets)
            },
        },
    )

    useSWR(
        [
            '/membership',
            {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                sort: {
                    order: '',
                    key: '',
                },
            } as MembershipQueryParams,
        ],
        (_: string, params: MembershipQueryParams) => apiGetMemberships(params),
        {
            revalidateOnFocus: false,
            onSuccess: (response) => {
                setMemberships(response.plans)
            },
        },
    )

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues as PodcastFormSchema)
        }
    }, [JSON.stringify(defaultValues), reset])

    const onSubmit = handleSubmit((values) => {
        onFormSubmit(values)
    })

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={onSubmit}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <GeneralSection
                            control={control as Control<PodcastFormSchema>}
                            errors={errors}
                            memberships={memberships.filter(
                                (plan) => plan.price_point === 'podcast',
                            )}
                        />
                    </div>
                    <div className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col">
                        <AttributeSection
                            control={control as Control<PodcastFormSchema>}
                            errors={errors}
                            assets={assets}
                        />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default ProductForm
