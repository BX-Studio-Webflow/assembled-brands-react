import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import type { Control, FieldErrors, FieldArrayWithId } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'
import { components } from 'react-select'
import Button from '@/components/ui/Button'
import { Controller } from 'react-hook-form'

import { FiX } from 'react-icons/fi'
import Checkbox from '@/components/ui/Checkbox'

const { Control } = components

interface Props {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
    fields: FieldArrayWithId<EventFormType, 'membership_plans', 'id'>[]
    append: () => void
    remove: (idx: number) => void
    plans: {
        name: string
        isFree: boolean
        cost: number
        payment_type: 'one_off' | 'recurring'
    }[]
}

const Membership = ({
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
                    className="mb-4 bEvent bEvent-green-400 bg-green-50 relative"
                >
                    {/* X icon in the top right */}
                    {idx > 0 && (
                        <button
                            type="button"
                            className="absolute top-4 right-4 p-1 rounded-full bEvent bEvent-gray-300 hover:bg-gray-100"
                            aria-label="Remove plan"
                            onClick={() => remove(idx)}
                        >
                            <FiX size={18} />
                        </button>
                    )}
                    <h4 className="mb-4 font-bold">Plan</h4>
                    <FormItem
                        label="Price plan name"
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
                                    placeholder="e.g. Basic, Pro, Enterprise"
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
                                <Checkbox
                                    checked={!!field.value}
                                    onChange={(value) => field.onChange(value)}
                                >
                                    Free
                                </Checkbox>
                            )}
                        />
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
                                        onChange={(e) => {
                                            const value =
                                                e.target.value === ''
                                                    ? 0
                                                    : parseFloat(e.target.value)
                                            field.onChange(value)
                                        }}
                                    />
                                )}
                            />
                        </FormItem>
                    )}

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
                    className="mt-2 bg-green-600 text-white"
                    onClick={append}
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

export default Membership
