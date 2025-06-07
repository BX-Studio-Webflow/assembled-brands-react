import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'
import type { Control, FieldErrors } from 'react-hook-form'

type CustomerDetailSectionProps = {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
}

const CustomerDetailSection = ({
    control,
    errors,
}: CustomerDetailSectionProps) => {
    return (
        <Card id="customerDetails">
            <h4 className="mb-6">Event details</h4>

            <FormItem
                label="Event name"
                invalid={Boolean(errors.event_name)}
                errorMessage={errors.event_name?.message}
            >
                <Controller
                    name="event_name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="on"
                            placeholder="Event name"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Event description"
                invalid={Boolean(errors.event_description)}
                errorMessage={errors.event_description?.message}
            >
                <Controller
                    name="event_description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="on"
                            placeholder="Event description"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default CustomerDetailSection
