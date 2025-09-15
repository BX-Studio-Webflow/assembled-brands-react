import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { Controller } from 'react-hook-form'
import { components } from 'react-select'
import Tag from '@/components/ui/Tag'
import type { FormSectionBaseProps } from './types'
import type { ControlProps, OptionProps } from 'react-select'
import { GetEventsResponse } from '@/@types/events'

type OverviewSectionProps = FormSectionBaseProps & {
    actions?: React.ReactNode
    events: GetEventsResponse | undefined
    newLead?: boolean
    statusText?: string
    statusIcon?: React.ReactNode
    statusClass?: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const OverviewSection = ({
    control,
    errors,
    actions,
    events,
    newLead,
    statusText,
    statusIcon,
    statusClass,
}: OverviewSectionProps) => {
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Overview</h4>
                {statusText && statusIcon && statusClass && (
                    <Tag className={statusClass} prefix={statusIcon}>
                        <span className="capitalize">{statusText}</span>
                    </Tag>
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="First Name"
                    invalid={Boolean(errors.firstName)}
                    errorMessage={errors.firstName?.message}
                >
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Last Name"
                    invalid={Boolean(errors.lastName)}
                    errorMessage={errors.lastName?.message}
                >
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Last Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="flex items-end gap-4 w-full">
                <FormItem
                    invalid={
                        Boolean(errors.phoneNumber) || Boolean(errors.dialCode)
                    }
                >
                    <label className="form-label mb-2">Dial Code</label>
                    <Controller
                        name="dialCode"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                options={dialCodeList}
                                {...field}
                                className="w-[150px]"
                                components={{
                                    Option: CustomSelectOption,
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={dialCodeList.filter(
                                    (option) => option.dialCode === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.dialCode)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    className="w-full"
                    invalid={
                        Boolean(errors.phoneNumber) || Boolean(errors.dialCode)
                    }
                    errorMessage={errors.phoneNumber?.message}
                >
                    <label className="form-label mb-2">Phone Number</label>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                type="tel"
                                autoComplete="off"
                                placeholder="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>

                
            </div>
            {newLead && (
                <FormItem
                    label="Invite to Event"
                    invalid={Boolean(errors.event_id)}
                    errorMessage={errors.event_id?.message}
                >
                    <Controller
                        name="event_id"
                        control={control}
                        render={({ field }) => (
                            <Select<{ value: number; label: string }>
                                options={(events?.events ?? []).map((ev) => ({
                                    value: ev.event.id,
                                    label: ev.event.event_name,
                                }))}
                                value={
                                    (events?.events ?? [])
                                        .map((ev) => ({
                                            value: ev.event.id,
                                            label: ev.event.event_name,
                                        }))
                                        .find(
                                            (opt) => opt.value === field.value,
                                        ) || null
                                }
                                name={field.name}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            )}
            <FormItem
                    className="w-full"
                    invalid={
                        Boolean(errors.notes)
                    }
                    errorMessage={errors.notes?.message}
                >
                    <label className="form-label mb-2">Notes</label>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                                 <Input placeholder="Add some notes" textArea {...field} />
                        )}
                    />
                </FormItem>
            {actions && <div className="mt-4">{actions}</div>}
        </Card>
    )
}

export default OverviewSection
