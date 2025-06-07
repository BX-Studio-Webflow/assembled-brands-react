import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import TagsSection from './TagsSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { LeadFormSchema } from './types'

type LeadFormProps = {
    onFormSubmit: (values: LeadFormSchema) => void
    defaultValues?: LeadFormSchema
    newLead?: boolean
    eventId?: number
} & CommonProps

const validationSchema: ZodType<LeadFormSchema> = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    dialCode: z.string().min(1, 'Please select your country code'),
    phoneNumber: z.string().min(1, 'Please input your mobile number'),
    img: z.string(),
    tags: z.array(z.object({ value: z.string(), label: z.string() })),
})

const LeadForm = (props: LeadFormProps) => {
    const { onFormSubmit, defaultValues = {}, children } = props

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

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <TagsSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default LeadForm
