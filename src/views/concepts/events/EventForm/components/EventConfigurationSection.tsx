import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'

type Props = {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
}

const EventConfigurationSection = ({ control, errors }: Props) => {
    return (
        <Card id="eventAssets">
            <h4 className="mb-6">Landing Page Details</h4>

            <FormItem
                label="Event landing page URL"
                invalid={Boolean(errors.landing_page_url)}
                errorMessage={errors.landing_page_url?.message}
            >
                <Controller
                    name="landing_page_url"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="https://www.something.com"
                            {...field}
                        />
                    )}
                />
            </FormItem>
   
            <FormItem
                label="After Booking redirect URL"
                invalid={Boolean(errors.success_url)}
                errorMessage={errors.success_url?.message}
            >
                <Controller
                    name="success_url"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="https://www.something.com"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Booking note"
                invalid={Boolean(errors.instructions)}
                errorMessage={errors.instructions?.message}
            >
                <Controller
                    name="instructions"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="Please be early"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <h4 className="mb-6">In Event Links</h4>
            <FormItem
                label="Scheduled Callback URL"
                invalid={Boolean(errors.calendar_url)}
                errorMessage={errors.calendar_url?.message}
            >
                <Controller
                    name="calendar_url"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="https://www.something.com"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Upgrade URL"
                invalid={Boolean(errors.upgrade_url)}
                errorMessage={errors.upgrade_url?.message}
            >
                <Controller
                    name="upgrade_url"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder="https://www.something.com"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            
            <FormItem
                label="Terms and Conditions"
                invalid={Boolean(errors.terms)}
                errorMessage={errors.terms?.message}
            >
                <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            checked={!!field.value}
                            onChange={field.onChange}
                        >
                            I agree to the terms and conditions
                        </Checkbox>
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default EventConfigurationSection
