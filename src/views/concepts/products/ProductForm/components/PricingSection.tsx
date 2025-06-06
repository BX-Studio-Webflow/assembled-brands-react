import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import { FormItem } from '@/components/ui/Form'
import type { Control, FieldErrors, FieldArrayWithId } from 'react-hook-form'
import type { PodcastFormSchema } from '../types'
import { components } from 'react-select'
import Button from '@/components/ui/Button'
import { Controller } from 'react-hook-form'
import { FiX } from 'react-icons/fi'

const { Control } = components

interface Props {
    control: Control<PodcastFormSchema>
    errors: FieldErrors<PodcastFormSchema>
    fields: FieldArrayWithId<PodcastFormSchema, 'membership_plans', 'id'>[]
    append: () => void
    remove: (idx: number) => void
    plans: PodcastFormSchema['membership_plans']
}

const MembershipCardSection = ({
    control,
    errors,
    fields,
    append,
    remove,
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
                            className="absolute top-4 right-4 p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            aria-label="Remove plan"
                            onClick={() => remove(idx)}
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
                    <FormItem
                        label="Price"
                        invalid={Boolean(errors.membership_plans?.[idx]?.price)}
                        errorMessage={
                            errors.membership_plans?.[idx]?.price?.message
                        }
                    >
                        <Controller
                            name={`membership_plans.${idx}.price` as const}
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
                    <FormItem
                        label="Price Point"
                        invalid={Boolean(
                            errors.membership_plans?.[idx]?.price_point,
                        )}
                        errorMessage={
                            errors.membership_plans?.[idx]?.price_point?.message
                        }
                    >
                        <Controller
                            name={
                                `membership_plans.${idx}.price_point` as const
                            }
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="e.g. monthly, yearly"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Billing"
                        invalid={Boolean(
                            errors.membership_plans?.[idx]?.billing,
                        )}
                        errorMessage={
                            errors.membership_plans?.[idx]?.billing?.message
                        }
                    >
                        <Controller
                            name={`membership_plans.${idx}.billing` as const}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="e.g. monthly, yearly"
                                    {...field}
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

export default MembershipCardSection
