import { useEffect, useState } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { LeadFormSchema } from './types'
import useSWR from 'swr'
import { apiGetEvents } from '@/services/EventService'
import { GetEventsResponse } from '@/@types/events'

type LeadFormProps = {
    onFormSubmit: (values: LeadFormSchema) => void
    defaultValues?: LeadFormSchema
    newLead?: boolean
    statusText?: string
    statusIcon?: React.ReactNode
    statusClass?: string
} & CommonProps

const validationSchema: ZodType<LeadFormSchema> = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    dialCode: z.string().min(1, 'Please select your country code'),
    phoneNumber: z.string().min(1, 'Please input your mobile number'),
    img: z.string(),
    event_id: z.number().optional(),
    notes: z.string().optional(),
    lead_status: z.enum(['new_lead', 'call_back', 'registered_for_event', 'attended_event']),
})

const LeadForm = (props: LeadFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        children,
        newLead,
        statusText,
        statusIcon,
        statusClass,
    } = props
    const [events, setEvents] = useState<GetEventsResponse | undefined>()
    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<LeadFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = async (values: LeadFormSchema) => {
        try {
            // Call the original onFormSubmit
            onFormSubmit?.(values)
        } catch (error) {
            console.error('Error creating lead:', error)
            throw error
        }
    }
    useSWR(
        ['/event'],

        () => apiGetEvents(),
        {
            revalidateOnFocus: false,
            onSuccess: (response) => {
                setEvents(response)
            },
        },
    )
    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection
                            control={control}
                            errors={errors}
                            actions={children}
                            events={events}
                            newLead={newLead}
                            statusText={statusText}
                            statusIcon={statusIcon}
                            statusClass={statusClass}
                        />
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default LeadForm
