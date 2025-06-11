import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Badge from '@/components/ui/Badge'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import { Form, FormItem } from '@/components/ui/Form'
import useEventlist from '../hooks/useEventList'
import { TbFilter } from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { ControlProps, OptionProps } from 'react-select'
import classNames from '@/utils/classNames'

type FormSchema = {
    eventType: string
    sortOrder: string
}

type Option = {
    value: string
    label: string
    className: string
}

const { Control } = components

const eventTypeOptions: Option[] = [
    {
        value: 'prerecorded',
        label: 'Pre-recorded',
        className: 'bg-emerald-500',
    },
    { value: 'live-video', label: 'Live video', className: 'bg-red-500' },
    { value: 'live-venue', label: 'Live venue', className: 'bg-amber-500' },
    { value: 'all', label: 'All', className: 'bg-gray-400' },
]

const sortByOptions: Option[] = [
    { value: 'asc', label: 'Ascending', className: 'bg-emerald-500' },
    { value: 'desc', label: 'Descending', className: 'bg-red-500' },
]

const CustomSelectOption = (props: OptionProps<Option>) => {
    return (
        <DefaultOption<Option>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Badge className={data.className} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Badge className={classNames('ml-4', selected.className)} />
            )}
            {children}
        </Control>
    )
}

const validationSchema: ZodType<FormSchema> = z.object({
    eventType: z.string(),
    sortOrder: z.string(),
})

const EventListTableFilter = () => {
    const [filterIsOpen, setFilterIsOpen] = useState(false)

    const { filterData, setFilterData } = useEventlist()

    const { handleSubmit, control, reset } = useForm<FormSchema>({
        defaultValues: {
            eventType: filterData?.eventType || 'all',
            sortOrder: filterData?.sortOrder || 'desc',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = (values: FormSchema) => {
        setFilterData(values)
        setFilterIsOpen(false)
    }

    const handleReset = () => {
        reset({
            eventType: 'all',
            sortOrder: 'desc',
        })
        setFilterData({
            eventType: 'all',
            sortOrder: 'desc',
        })
        setFilterIsOpen(false)
    }

    return (
        <>
            <Button icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
                Filter
            </Button>
            <Drawer
                title="Filter"
                isOpen={filterIsOpen}
                onClose={() => setFilterIsOpen(false)}
                onRequestClose={() => setFilterIsOpen(false)}
            >
                <Form
                    className="h-full"
                    containerClassName="flex flex-col justify-between h-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <FormItem label="Event type">
                            <Controller
                                name="eventType"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={eventTypeOptions}
                                        {...field}
                                        value={eventTypeOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        components={{
                                            Option: CustomSelectOption,
                                            Control: CustomControl,
                                        }}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                        isClearable
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Sort by date">
                            <Controller
                                name="sortOrder"
                                control={control}
                                render={({ field }) => (
                                    <Select<Option>
                                        options={sortByOptions}
                                        {...field}
                                        value={sortByOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        components={{
                                            Option: CustomSelectOption,
                                            Control: CustomControl,
                                        }}
                                        onChange={(option) =>
                                            field.onChange(option?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant="solid"
                            type="submit"
                            className="flex-1"
                        >
                            Apply Filters
                        </Button>
                        <Button
                            variant="plain"
                            type="button"
                            onClick={handleReset}
                            className="flex-1"
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
    )
}

export default EventListTableFilter
