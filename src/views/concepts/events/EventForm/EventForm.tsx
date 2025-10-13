import { useState, useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import EventDetailsSection from './components/EventDetailsSection'
import EventConfigurationSection from './components/EventConfigurationSection'
import MembershipPlansSection from './components/MembershipPlansSection'
//import useLayoutGap from '@/utils/hooks/useLayoutGap'
//import useResponsive from '@/utils/hooks/useResponsive'
import useSWR from 'swr'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EventFormSchema, EventFormType } from './validation/eventFormSchema'
import type { ReactNode } from 'react'
import type { TableQueries, CommonProps } from '@/@types/common'
import { apiGetAssets } from '@/services/AssetService'
import type { Asset, AssetQueryParams } from '@/@types/asset'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { AxiosError } from 'axios'
import { EventWithDetailsAndCount } from '@/@types/events'

type EventFormProps = {
    children: ReactNode
    onFormSubmit: (values: EventFormType) => void
    defaultValues?: Partial<EventFormType>
    event?: EventWithDetailsAndCount
    newEvent?: boolean
} & CommonProps

const defaultPlan = {
    name: '',
    isFree: true,
    cost: 0,
    date: new Date(),
    payment_type: 'one_off' as const,
}

const defaultValues = {
    event_name: '',
    event_description: '',
    status: 'active' as const,
    membership_plans: [defaultPlan],
    event_type: 'live_venue' as const,
    terms: true as const,
    asset_id: 0,
    image_asset_id: 0,
    duration: 60,
    live_video_url: '',
    live_venue_address: '',
    course_url_external: '',
    course_internal: false,
    invite_existing_leads: false,
    instructions: '',
    landing_page_url: '',
    success_url: '',
    calendar_url: '',
    upgrade_url: '',
}

const EventForm = (props: EventFormProps) => {
    const { children } = props
    const [assets, setAssets] = useState<Asset[]>([])
    //const { getTopGapValue } = useLayoutGap()
    //const { larger } = useResponsive()

    useSWR(
        [
            '/asset',
            {
                pageIndex: 1,
                pageSize: 10,
                search: '',
                sort: {
                    order: 'asc' as const,
                    key: '',
                },
            } as TableQueries,
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

    const methods = useForm<EventFormType>({
        resolver: zodResolver(EventFormSchema),
        defaultValues: props.defaultValues || defaultValues,
        mode: 'onTouched',
    })

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'membership_plans',
        shouldUnregister: false,
    })

    const plans = methods.watch('membership_plans') || []

    // Initialize field array if empty
    useEffect(() => {
        if (fields.length === 0 && plans.length > 0) {
            plans.forEach((plan) => {
                append(plan)
            })
        }
    }, [fields.length, plans, append])

    const onSubmit = async (values: EventFormType) => {
        try {
            const payload = {
                ...values,
                event_name: values.event_name.trim(),
                event_description: values.event_description?.trim(),
                live_video_url: values.live_video_url?.trim(),
                live_venue_address: values.live_venue_address?.trim(),
                course_url_external: values.course_url_external?.trim(),
                landing_page_url: values.landing_page_url?.trim(),
                success_url: values.success_url?.trim(),
                calendar_url: values.calendar_url?.trim(),
                upgrade_url: values.upgrade_url?.trim(),
                instructions: values.instructions?.trim(),
                image_asset_id: Number(values.image_asset_id),
                asset_id: Number(values.asset_id),
                membership_plans: values.membership_plans.map((plan) => ({
                    ...plan,
                    id: plan.id,
                    name: plan.name.trim(),
                    isFree: plan.isFree,
                    cost: plan.cost,
                    payment_type: plan.payment_type,
                    date:
                        typeof plan.date === 'object' &&
                            plan.date instanceof Date
                            ? plan.date.getTime()
                            : plan.date,
                })),
            }
            if (props.onFormSubmit) {
                await props.onFormSubmit(payload)
            }
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <div className="flex">
            <FormProvider {...methods}>
                <Form
                    className="flex-1 flex flex-col overflow-hidden"
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <Container>
                        <div className="flex gap-4">


                            <div className="flex-1">
                                <div className="flex flex-col gap-4">
                                    <EventDetailsSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                        assets={assets}
                                    />
                                    <MembershipPlansSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                        fields={fields}
                                        append={() => append(defaultPlan)}
                                        remove={remove}
                                        plans={plans}
                                    />
                                    <EventConfigurationSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    />
                                </div>
                            </div>
                        </div>
                    </Container>
                    <BottomStickyBar>{children}</BottomStickyBar>
                </Form>
            </FormProvider>
        </div>
    )
}

export default EventForm
