import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Radio from '@/components/ui/Radio'
import { Controller } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'
import type { Control, FieldErrors } from 'react-hook-form'

type EventDetailsSectionProps = {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
}

const EventDetailsSection = ({ control, errors }: EventDetailsSectionProps) => {
    return (
        <Card id="eventDetails">
            <h4 className="mb-6">Event details</h4>

            <FormItem
                label="Choose Event Type"
                invalid={Boolean(errors.event_type)}
                errorMessage={errors.event_type?.message}
            >
                <Controller
                    name="event_type"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Radio
                                className="mr-4"
                                name="event_type"
                                value="prerecorded"
                                checked={field.value === 'prerecorded'}
                                onChange={() => {
                                    field.onChange('prerecorded')
                                }}
                            >
                                Pre-Recorded
                            </Radio>
                            <Radio
                                className="mr-4"
                                name="event_type"
                                value="live_venue"
                                checked={field.value === 'live_venue'}
                                onChange={() => {
                                    field.onChange('live_venue')
                                }}
                            >
                                Live Venue
                            </Radio>
                            <Radio
                                name="event_type"
                                value="live_video_call"
                                checked={field.value === 'live_video_call'}
                                onChange={() => {
                                    field.onChange('live_video_call')
                                }}
                            >
                                Live Video Call
                            </Radio>
                        </div>
                    )}
                />
            </FormItem>

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

export default EventDetailsSection
