import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'

import type { FormSectionBaseProps } from '../types'
import { Radio } from '@/components/ui/Radio'
import type { Asset } from '@/@types/asset'

// Only AttributeSection expects assets
export type AttributeSectionProps = FormSectionBaseProps & { assets: Asset[] }

const AttributeSection = ({
    control,
    errors,
    assets,
}: AttributeSectionProps) => {
    const episodeType = useWatch({ control, name: 'episode_type' })
    const type = useWatch({ control, name: 'podcast_type' })
    const options = assets
        .filter((asset: Asset) => asset.asset_type === 'audio')
        .map((asset: Asset) => ({
            value: asset.id,
            label: asset.asset_name,
        }))
    const coverImageOptions = assets
        .filter((asset: Asset) => asset.asset_type === 'image')
        .map((asset: Asset) => ({
            value: asset.id,
            label: asset.asset_name,
        }))
    return (
        <Card>
            <h4 className="mb-6">Attribute</h4>
            <FormItem label="Choose Podcast Type">
                <Controller
                    name="podcast_type"
                    control={control}
                    render={({ field }) => (
                        <Radio.Group
                            value={field.value}
                            className="flex gap-x-16 w-full"
                            onChange={field.onChange}
                        >
                            <Radio value="prerecorded">Pre-Recorded</Radio>
                            <Radio value="live">Live</Radio>
                        </Radio.Group>
                    )}
                />
            </FormItem>
            {type === 'prerecorded' && (
                <FormItem
                    label="Audio"
                    invalid={Boolean(errors.asset)}
                    errorMessage={errors.asset?.message}
                >
                    <Controller
                        name="asset"
                        control={control}
                        render={({ field }) => (
                            <Select
                                isMulti={episodeType === 'series'}
                                placeholder="Select an audio file"
                                options={options}
                                onChange={(option) =>
                                    episodeType === 'series'
                                        ? field.onChange(
                                              option
                                                  ? (
                                                        option as unknown as {
                                                            value: number
                                                        }[]
                                                    ).map((o) => o.value)
                                                  : [],
                                          )
                                        : field.onChange(
                                              (
                                                  option as {
                                                      value: number
                                                  } | null
                                              )?.value,
                                          )
                                }
                            />
                        )}
                    />
                </FormItem>
            )}
            {type === 'live' && (
                <FormItem
                    label="Podcast URL"
                    invalid={Boolean(errors.podcast_url)}
                    errorMessage={errors.podcast_url?.message}
                >
                    <Controller
                        name="podcast_url"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="url"
                                autoComplete="off"
                                placeholder="Podcast URL"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            )}
            <FormItem
                label="Landing page URL"
                invalid={Boolean(errors.landing_page_url)}
                errorMessage={errors.landing_page_url?.message}
            >
                <Controller
                    name="landing_page_url"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="url"
                            autoComplete="off"
                            placeholder="Landing page URL"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label="Cover Image"
                invalid={Boolean(errors.cover_image_asset_id)}
                errorMessage={errors.cover_image_asset_id?.message}
            >
                <Controller
                    name="cover_image_asset_id"
                    control={control}
                    render={({ field }) => (
                        <Select
                            placeholder="Select a cover image"
                            options={coverImageOptions}
                            value={coverImageOptions.find(
                                (opt) => opt.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default AttributeSection
