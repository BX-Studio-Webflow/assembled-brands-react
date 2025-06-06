import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GeneralSection from './components/GeneralSection'
import AttributeSection from './components/AttributeSection'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import type { PodcastFormSchema } from './types'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import MembershipCardSection from './components/PricingSection'
import useSWR from 'swr'
import type { Asset, AssetQueryParams } from '@/@types/asset'
import { apiGetAssets } from '@/services/AssetService'

// Default membership plan logic (similar to OrderForm)
const defaultPlan = {
    id: 1,
    name: 'Membership',
    price: 10,
    price_point: 'monthly',
    billing: 'monthly',
}

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
        .array(
            z.object({
                id: z.number(),
                name: z.string(),
                price: z.union([z.string(), z.number()]),
                price_point: z.string(),
                billing: z.string(),
            }),
        )
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
            imgList: [],
            membership_plans: [defaultPlan],
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
        watch,
    } = useForm<PodcastFormSchema>({
        defaultValues: {
            ...defaultValues,
            membership_plans: defaultValues.membership_plans?.length
                ? defaultValues.membership_plans
                : [defaultPlan],
        },
        resolver: zodResolver(validationSchema),
    })

    const [assets, setAssets] = useState<Asset[]>([])

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetAssets(params as AssetQueryParams),
        {
            revalidateOnFocus: false,
            onSuccess: (response) => {
                setAssets(response.assets)
            },
        },
    )

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset({
                ...defaultValues,
                membership_plans: defaultValues.membership_plans?.length
                    ? defaultValues.membership_plans
                    : [defaultPlan],
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'membership_plans',
    })

    const plans = watch('membership_plans') || []

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit((values) => onFormSubmit?.(values))}
        >
            <Container>
                <div className="flex flex-col xl:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <GeneralSection control={control} errors={errors} />
                        <MembershipCardSection
                            control={control}
                            errors={errors}
                            fields={fields}
                            append={() => append(defaultPlan)}
                            remove={remove}
                            plans={plans}
                        />
                    </div>
                    <div className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col">
                        <AttributeSection
                            control={control}
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
