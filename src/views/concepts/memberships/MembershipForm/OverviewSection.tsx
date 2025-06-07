import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'

type OverviewSectionProps = FormSectionBaseProps

type PaymentType = 'one_off' | 'recurring'
type PricePoint = 'standalone' | 'course' | 'podcast'
type BillingType = 'per-day' | 'package'

type Option<T> = {
    value: T
    label: string
}

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
    const paymentTypeOptions: Option<PaymentType>[] = [
        { value: 'one_off', label: 'One Off' },
        { value: 'recurring', label: 'Recurring' },
    ]

    const pricePointOptions: Option<PricePoint>[] = [
        { value: 'standalone', label: 'Standalone' },
        { value: 'course', label: 'Course' },
        { value: 'podcast', label: 'Podcast' },
    ]

    const billingOptions: Option<BillingType>[] = [
        { value: 'per-day', label: 'Per Day' },
        { value: 'package', label: 'Package' },
    ]

    return (
        <Card>
            <h4 className="mb-6">Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Membership Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Price"
                    invalid={Boolean(errors.price)}
                    errorMessage={errors.price?.message}
                >
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                autoComplete="off"
                                placeholder="Price"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Description"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Description"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Payment Type"
                    invalid={Boolean(errors.payment_type)}
                    errorMessage={errors.payment_type?.message}
                >
                    <Controller
                        name="payment_type"
                        control={control}
                        render={({ field }) => (
                            <Select<Option<PaymentType>>
                                options={paymentTypeOptions}
                                value={paymentTypeOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                onBlur={field.onBlur}
                                placeholder="Select Payment Type"
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Price Point"
                    invalid={Boolean(errors.price_point)}
                    errorMessage={errors.price_point?.message}
                >
                    <Controller
                        name="price_point"
                        control={control}
                        render={({ field }) => (
                            <Select<Option<PricePoint>>
                                options={pricePointOptions}
                                value={pricePointOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                onBlur={field.onBlur}
                                placeholder="Select Price Point"
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Billing"
                invalid={Boolean(errors.billing)}
                errorMessage={errors.billing?.message}
            >
                <Controller
                    name="billing"
                    control={control}
                    render={({ field }) => (
                        <Select<Option<BillingType>>
                            options={billingOptions}
                            value={
                                field.value
                                    ? billingOptions.find(
                                          (option) =>
                                              option.value === field.value,
                                      )
                                    : null
                            }
                            onChange={(option) => field.onChange(option?.value)}
                            onBlur={field.onBlur}
                            placeholder="Select Billing Type"
                            isClearable
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default OverviewSection
