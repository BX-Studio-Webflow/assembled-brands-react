import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Affix from '@/components/shared/Affix'
import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { apiGetProductList } from '@/services/ProductService'
import CustomerDetailSection from './components/CustomerDetailSection'
import BillingAddressSection from './components/BillingAddressSection'
import PaymentMethodSection from './components/PaymentMethodSection'
import Navigator from './components/Navigator'
import { useOrderFormStore } from './store/orderFormStore'
import useLayoutGap from '@/utils/hooks/useLayoutGap'
import useResponsive from '@/utils/hooks/useResponsive'
import useSWR from 'swr'
import isEmpty from 'lodash/isEmpty'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EventFormSchema, EventFormType } from './validation/eventFormSchema'
import type { ReactNode } from 'react'
import type { TableQueries, CommonProps } from '@/@types/common'
import { apiCreateEvent } from '@/services/EventService'

type OrderFormProps = {
    children: ReactNode
    onFormSubmit: (values: EventFormType) => void
    defaultValues?: Partial<EventFormType>
    defaultProducts?: any[]
    newOrder?: boolean
} & CommonProps

const defaultPlan = {
    name: '',
    isFree: false,
    cost: 0,
    date: 0,
    payment_type: 'one_off' as const,
}

const OrderForm = (props: OrderFormProps) => {
    const { onFormSubmit, children, defaultValues, defaultProducts } = props
    const [submitting, setSubmitting] = useState(false)

    const { setProductOption, setProductList, setSelectedProduct } =
        useOrderFormStore()

    const { getTopGapValue } = useLayoutGap()
    const { larger } = useResponsive()

    useSWR(
        [
            '/api/products',
            {
                pageIndex: 1,
                pageSize: 10,
                query: '',
                sort: {
                    order: '',
                    key: '',
                },
            } as TableQueries,
        ],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetProductList<any, TableQueries>(params),
        {
            revalidateOnFocus: false,
            onSuccess: (resp) => {
                const list = resp.list.map(
                    ({ id: value, name: label, img, stock: quantity }) => ({
                        label,
                        value,
                        img,
                        quantity,
                    }),
                )
                setProductList(resp.list)
                setProductOption(list)
            },
        },
    )

    useEffect(() => {
        if (defaultProducts) {
            setSelectedProduct(defaultProducts)
        }
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        return () => {
            setSelectedProduct([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        control,
        register,
    } = useForm<EventFormType>({
        resolver: zodResolver(EventFormSchema),
        defaultValues: {
            event_name: '',
            event_description: '',
            membership_plans: [defaultPlan],
            event_type: 'prerecorded',
            asset_id: 1,
            status: 'active',
        },
        mode: 'onTouched',
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'membership_plans',
    })

    const plans = watch('membership_plans') || []

    const onSubmit = async (values: EventFormType) => {
        setSubmitting(true)
        // Transform membership_plans.date to unix timestamp (seconds)
        const payload = {
            ...values,
            membership_plans: values.membership_plans.map((plan) => ({
                ...plan,
                date:
                    plan.date instanceof Date
                        ? Math.floor(plan.date.getTime() / 1000)
                        : plan.date,
                cost: Number(plan.cost),
            })),
            asset_id: Number(values.asset_id),
        }
        await apiCreateEvent(payload)
        setSubmitting(false)
        onFormSubmit?.(payload)
    }

    return (
        <div className="flex">
            <Form
                className="flex-1 flex flex-col overflow-hidden"
                onSubmit={handleSubmit(onSubmit)}
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
                                    control={control}
                                    errors={errors}
                                />
                                <BillingAddressSection
                                    control={control}
                                    errors={errors}
                                    fields={fields}
                                    append={() => append(defaultPlan)}
                                    remove={remove}
                                    plans={plans}
                                    defaultPlan={defaultPlan}
                                />
                                <PaymentMethodSection
                                    control={control}
                                    errors={errors}
                                    register={register}
                                    watch={watch}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
                <BottomStickyBar>{children}</BottomStickyBar>
            </Form>
        </div>
    )
}

export default OrderForm
