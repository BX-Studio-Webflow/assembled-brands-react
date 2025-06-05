import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'
import { useState } from 'react'
import type { Asset } from '@/@types/asset'

type Props = {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
    assets?: Asset[]
}

type AssetOption = {
    value: string
    label: string
    color: string
}

const PaymentMethodSection = ({ control, errors, assets = [] }: Props) => {
    const [eventType, setEventType] = useState<string>('')
    console.log(assets)
    const assetOptions: AssetOption[] = assets
        .filter((asset) => asset.asset_type === 'video')
        .map((asset) => ({
            value: asset.id.toString(),
            label: asset.asset_name,
            color: '#00B8D9', // Default color for all assets
        }))

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
                                onChange={() => {
                                    field.onChange('prerecorded')
                                    setEventType('prerecorded')
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
                                    setEventType('live_venue')
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
                                    setEventType('live_video_call')
                                }}
                            >
                                Live Video Call
                            </Radio>
                        </div>
                    )}
                />
            </FormItem>

            {eventType === 'prerecorded' && (
                <FormItem
                    label="Select Asset"
                    invalid={Boolean(errors.asset_id)}
                    errorMessage={errors.asset_id?.message}
                >
                    <Controller
                        name="asset_id"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Select<AssetOption>
                                placeholder="Please Select"
                                options={assetOptions}
                                value={assetOptions.find(
                                    (option) =>
                                        option.value === value?.toString(),
                                )}
                                onChange={(option) => onChange(option?.value)}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            )}

            {eventType === 'live_venue' && (
                <FormItem
                    label="Live Venue Address"
                    invalid={Boolean(errors.live_venue_address)}
                    errorMessage={errors.live_venue_address?.message}
                >
                    <Controller
                        name="live_venue_address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter live venue address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            )}

            {eventType === 'live_video_call' && (
                <FormItem
                    label="Live Video Call URL"
                    invalid={Boolean(errors.live_video_url)}
                    errorMessage={errors.live_video_url?.message}
                >
                    <Controller
                        name="live_video_url"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter live video call URL"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            )}

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

export default PaymentMethodSection
