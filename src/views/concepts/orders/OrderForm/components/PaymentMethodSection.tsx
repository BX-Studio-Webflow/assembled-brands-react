import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

interface EventFormSchema {
    event_type: 'prerecorded' | 'live_venue' | 'live_video_call'
    instructions?: string
    landing_page_url?: string
    success_url?: string
    calendar_url?: string
    course_url_external?: string
    course_internal?: boolean
    invite_existing_leads?: boolean
    terms: boolean
}

interface Props {
    control: Control<EventFormSchema>
    errors: FieldErrors<EventFormSchema>
    register: UseFormRegister<EventFormSchema>
}

const PaymentMethodSection = ({ control, errors }: Props) => {
    return (
        <Card id="eventDetails">
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
                                onChange={() => field.onChange('prerecorded')}
                            >
                                Pre-Recorded
                            </Radio>
                            <Radio
                                className="mr-4"
                                name="event_type"
                                value="live_venue"
                                checked={field.value === 'live_venue'}
                                onChange={() => field.onChange('live_venue')}
                            >
                                Live Venue
                            </Radio>
                            <Radio
                                name="event_type"
                                value="live_video_call"
                                checked={field.value === 'live_video_call'}
                                onChange={() =>
                                    field.onChange('live_video_call')
                                }
                            >
                                Live Video Call
                            </Radio>
                        </div>
                    )}
                />
            </FormItem>

            <FormItem
                label="Pre-Event Instructions shown on payment confirmation email (Optional)"
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

            <FormItem
                label="Landing Page or Source URL where the leads come from"
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
                label="Redirect URL after form is filled successfully"
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
                label="Calendar URL for scheduling callback"
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
                label="Course Url (External) (Coming Soon)"
                invalid={Boolean(errors.course_url_external)}
                errorMessage={errors.course_url_external?.message}
            >
                <Controller
                    name="course_url_external"
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
                label="Course Internal (Coming Soon)"
                invalid={Boolean(errors.course_internal)}
                errorMessage={errors.course_internal?.message}
            >
                <Controller
                    name="course_internal"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            checked={!!field.value}
                            onChange={field.onChange}
                        >
                            Yes
                        </Checkbox>
                    )}
                />
            </FormItem>

            <FormItem
                label="Send Invite to existing leads"
                invalid={Boolean(errors.invite_existing_leads)}
                errorMessage={errors.invite_existing_leads?.message}
            >
                <Controller
                    name="invite_existing_leads"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            checked={!!field.value}
                            onChange={field.onChange}
                        >
                            Yes
                        </Checkbox>
                    )}
                />
            </FormItem>

            
        </Card>
    )
}

export default PaymentMethodSection
