import { useState, useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Affix from '@/components/shared/Affix'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import CustomerDetailSection from './components/CustomerDetailSection'
import BillingAddressSection from './components/BillingAddressSection'
import PaymentMethodSection from './components/PaymentMethodSection'
import Navigator from './components/Navigator'
import useLayoutGap from '@/utils/hooks/useLayoutGap'
import useResponsive from '@/utils/hooks/useResponsive'
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

type EventFormProps = {
    children: ReactNode
    onFormSubmit: (values: EventFormType) => void
    defaultValues?: Partial<EventFormType>
    newEvent?: boolean
} & CommonProps

const defaultPlan = {
    name: '',
    isFree: false,
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
    live_video_url: '',
    live_venue_address: '',
    course_url_external: '',
    course_internal: false,
    invite_existing_leads: false,
    instructions: '',
    landing_page_url: '',
    success_url: '',
    calendar_url: '',
}

const EventForm = (props: EventFormProps) => {
    const { children } = props
    const [assets, setAssets] = useState<Asset[]>([])
    const { getTopGapValue } = useLayoutGap()
    const { larger } = useResponsive()

    useSWR(
        [
            '/asset',
            {
                pageIndex: 1,
                pageSize: 10,
                query: '',
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
                console.log(response)
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

    console.log('Form defaultValues:', props.defaultValues)
    console.log('Membership plans:', plans)
    console.log('Fields:', fields)

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
                membership_plans: values.membership_plans.map((plan) => ({
                    ...plan,
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
            console.error(error)
            toast.push(
                <Notification type="danger">
                    {error instanceof Error
                        ? error.message
                        : 'Event creation failed!'}
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
                            {larger.xl && (
                                <div className="w-[360px]">
                                    <Affix offset={getTopGapValue()}>
                                        <Card>
                                            <Navigator />
                                        </Card>
                                    </Affix>
                                </div>
                            )}

                            <div className="flex-1">
                                <div className="flex flex-col gap-4">
                                    <CustomerDetailSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                    />

                                    <PaymentMethodSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                        assets={assets}
                                    />

                                    <BillingAddressSection
                                        control={methods.control}
                                        errors={methods.formState.errors}
                                        fields={fields}
                                        append={() => append(defaultPlan)}
                                        remove={remove}
                                        plans={plans}
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
