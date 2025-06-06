import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Controller, useWatch } from 'react-hook-form'
import { Radio } from '@/components/ui/Radio'
import { Checkbox } from '@/components/ui'
import type { FormSectionBaseProps } from '../types'
import type { Membership } from '@/@types/membership'

type GeneralSectionProps = FormSectionBaseProps & {
    memberships?: Membership[]
}

const GeneralSection = ({
    control,
    errors,
    memberships = [],
}: GeneralSectionProps) => {
    const type = useWatch({ control, name: 'episode_type' })
    const label = type === 'episode' ? 'Episode Name' : 'Series Name'

    return (
        <Card>
            <h4 className="mb-6">Basic Information</h4>
            <FormItem label="Is this a Series with multiple Episodes or just a Single Episode Only?">
                <Controller
                    name="episode_type"
                    control={control}
                    render={({ field }) => (
                        <Radio.Group
                            value={field.value}
                            onChange={field.onChange}
                            className="flex gap-x-16 w-full"
                        >
                            <Radio value="series">Series</Radio>
                            <Radio value="episode">Episode</Radio>
                        </Radio.Group>
                    )}
                />
            </FormItem>
            <div>
                <FormItem
                    label={label}
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
                                placeholder={label}
                                {...field}
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
                        <RichTextEditor
                            content={field.value}
                            invalid={Boolean(errors.description)}
                            onChange={({ html }) => {
                                field.onChange(html)
                            }}
                        />
                    )}
                />
            </FormItem>
            <FormItem label="Choose Membership Plans">
                <Controller
                    name="membership_plans"
                    control={control}
                    render={({ field: { value = [], onChange } }) => (
                        <Checkbox.Group
                            value={value.map((id) => id.toString())}
                            onChange={(selectedIds) => {
                                const selectedPlans = memberships.filter((m) =>
                                    selectedIds.includes(m.id.toString()),
                                )
                                onChange(selectedPlans.map((plan) => plan.id))
                            }}
                            className="flex flex-col gap-y-4"
                        >
                            {memberships.map((membership) => (
                                <Checkbox
                                    key={membership.id}
                                    value={membership.id.toString()}
                                >
                                    {membership.name}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default GeneralSection
