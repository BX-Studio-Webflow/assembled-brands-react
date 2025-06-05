import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import type { Control, FieldErrors, FieldArrayWithId } from 'react-hook-form'
import { components } from 'react-select'
import Button from '@/components/ui/Button'
import { Controller } from 'react-hook-form'
import DatePicker from '@/components/ui/DatePicker'
import { FiX } from 'react-icons/fi'

const { Control } = components
const { DateTimepicker } = DatePicker

// Minimal event form schema for this section
interface MembershipPlan {
    name: string
    isFree?: boolean
    cost?: number
    date: string
    payment_type: 'one_off' | 'recurring'
}
interface EventFormSchema {
    membership_plans: MembershipPlan[]
}

interface Props {
    control: Control<EventFormSchema>
    errors: FieldErrors<EventFormSchema>
    fields: FieldArrayWithId<EventFormSchema, 'membership_plans', 'id'>[]
    append: () => void
    remove: (idx: number) => void
    plans: MembershipPlan[]
}

const BillingAddressSection = ({
    control,
    errors,
    fields,
    append,
    remove,
    plans,
}: Props) => {
    const safeFields = Array.isArray(fields) ? fields : []
    return (
        <div>
            {safeFields.map((field, idx) => (
                <Card
                    key={field.id}
                    className="mb-4 border border-green-400 bg-green-50 relative"
                >
                    {/* X icon in the top right */}
                    {idx > 0 && (
                        <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="absolute top-4 right-4 p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            aria-label="Remove plan"
                        >
                            <FiX size={18} />
                        </button>
                    )}
                    <h4 className="mb-4 font-bold">Plan</h4>
                    <FormItem
                        label="Price plan ticket name"
                        invalid={Boolean(errors.membership_plans?.[idx]?.name)}
                        errorMessage={
                            errors.membership_plans?.[idx]?.name?.message
                        }
                    >
                        <Controller
                            name={`membership_plans.${idx}.name` as const}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="1 day event on 23rd of..."
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex items-center mb-2">
                        <Controller
                            name={`membership_plans.${idx}.isFree` as const}
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    checked={!!field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                            )}
                        />{' '}
                        Free
                    </div>
                    {!plans[idx]?.isFree && (
                        <FormItem
                            label="Price"
                            invalid={Boolean(
                                errors.membership_plans?.[idx]?.cost,
                            )}
                            errorMessage={
                                errors.membership_plans?.[idx]?.cost?.message
                            }
                        >
                            <Controller
                                name={`membership_plans.${idx}.cost` as const}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g. £120.99"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    )}
                    <FormItem
                        label="Start date/time of this plan"
                        invalid={Boolean(errors.membership_plans?.[idx]?.date)}
                        errorMessage={
                            errors.membership_plans?.[idx]?.date?.message
                        }
                    >
                        <Controller
                            name={`membership_plans.${idx}.date` as const}
                            control={control}
                            render={({ field }) => (
                                <DateTimepicker
                                    placeholder="Pick date & time"
                                    value={
                                        field.value
                                            ? new Date(field.value)
                                            : undefined
                                    }
                                    onChange={(date) =>
                                        field.onChange(
                                            date ? date.toISOString() : '',
                                        )
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Payment frequency"
                        invalid={Boolean(
                            errors.membership_plans?.[idx]?.payment_type,
                        )}
                        errorMessage={
                            errors.membership_plans?.[idx]?.payment_type
                                ?.message
                        }
                    >
                        <Controller
                            name={
                                `membership_plans.${idx}.payment_type` as const
                            }
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={[
                                        { value: 'one_off', label: 'One Off' },
                                        {
                                            value: 'recurring',
                                            label: 'Recurring',
                                        },
                                    ]}
                                    placeholder="Select one..."
                                    value={
                                        field.value
                                            ? {
                                                  value: field.value,
                                                  label:
                                                      field.value === 'one_off'
                                                          ? 'One Off'
                                                          : 'Recurring',
                                              }
                                            : undefined
                                    }
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </Card>
            ))}
            <div className="flex justify-center">
                <Button
                    type="button"
                    onClick={append}
                    className="mt-2 bg-green-600 text-white"
                >
                    Add another plan
                </Button>
            </div>
            {errors.membership_plans &&
                typeof errors.membership_plans.message === 'string' && (
                    <span className="text-error">
                        {errors.membership_plans.message}
                    </span>
                )}
        </div>
    )
}

export default BillingAddressSection
