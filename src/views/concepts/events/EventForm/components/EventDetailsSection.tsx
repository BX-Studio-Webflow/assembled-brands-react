import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'
import { Controller, useFormContext } from 'react-hook-form'
import type { EventFormType } from '../validation/eventFormSchema'
import type { Control, FieldErrors } from 'react-hook-form'
import type { Asset } from '@/@types/asset'
import { Avatar } from '@/components/ui/Avatar'

type EventDetailsSectionProps = {
    control: Control<EventFormType>
    errors: FieldErrors<EventFormType>
    assets?: Asset[]
}

type AssetOption = {
    value: string
    label: string
    color: string
}

const EventDetailsSection = ({
    control,
    errors,
    assets = [],
}: EventDetailsSectionProps) => {
    const { watch } = useFormContext<EventFormType>()
    const eventType = watch('event_type')

    const assetOptions: AssetOption[] = assets
        .filter((asset) => asset.asset_type === 'video')
        .map((asset) => ({
            value: asset.id.toString(),
            label: asset.asset_name,
            color: '#00B8D9', // Default color for all assets
        }))

    const imageAssetOptions: AssetOption[] = assets
        .filter((asset) => asset.asset_type === 'image')
        .map((asset) => ({
            value: asset.id.toString(),
            label: asset.asset_name,
            color: '#00B8D9', // Default color for all assets
        }))
    const imageAssetId = watch('image_asset_id')
    const imageAsset = assets.find((asset) => asset.id === Number(imageAssetId))

    return (
        <Card id="eventDetails">
            <h4 className="mb-6">Event</h4>

            <FormItem
                label="Event Type"
                invalid={Boolean(errors.event_type)}
                errorMessage={errors.event_type?.message}
            >
                <Controller
                    name="event_type"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col sm:flex-row gap-1">
                            <Radio
                                className="mr-4"
                                name="event_type"
                                value="prerecorded"
                                checked={field.value === 'prerecorded'}
                                onChange={() => {
                                    field.onChange('prerecorded')
                                }}
                            >
                                Pre-recorded (Video Stream)
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
                                In person Event (Physical Location)
                            </Radio>
                            <Radio
                                name="event_type"
                                value="live_video_call"
                                checked={field.value === 'live_video_call'}
                                onChange={() => {
                                    field.onChange('live_video_call')
                                }}
                            >
                                Live Online Event (Zoom)
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
                label="Duration (minutes)"
                invalid={Boolean(errors.duration)}
                errorMessage={errors.duration?.message}
            >
                <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            step="1"
                            min="1"
                            placeholder="e.g. 60"
                            {...field}
                        />
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

            <FormItem
                label="Select Event Image"
                invalid={Boolean(errors.image_asset_id)}
                errorMessage={errors.image_asset_id?.message}
            >
                <Controller
                    name="image_asset_id"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Select<AssetOption>
                            placeholder="Please Select"
                            options={imageAssetOptions}
                            value={imageAssetOptions.find(
                                (option) => option.value === value?.toString(),
                            )}
                            onChange={(option) => onChange(option?.value)}
                            {...field}
                        />
                    )}
                />
            </FormItem>
            {imageAssetId && imageAsset?.presignedUrl && (
                <Avatar shape="round" style={{ width: '100%', maxWidth: '300px', height: 'auto' }} className="mr-4" src={imageAsset ? imageAsset.presignedUrl : '/img/avatars/thumb-1.jpg'} />
            )}
        </Card>
    )
}

export default EventDetailsSection
