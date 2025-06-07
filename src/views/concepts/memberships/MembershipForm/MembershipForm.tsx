import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { MembershipFormSchema } from './types'

type MembershipFormProps = {
    onFormSubmit: (values: MembershipFormSchema) => void
    defaultValues?: MembershipFormSchema
    newMembership?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    payment_type: z.enum(['one_off', 'recurring']),
    price_point: z.enum(['standalone', 'course', 'podcast']),
    billing: z.enum(['per-day', 'package']).optional(),
    dates: z.array(z.string()).optional(),
}) satisfies ZodType<MembershipFormSchema>

const MembershipForm = (props: MembershipFormProps) => {
    const { onFormSubmit, defaultValues = {}, children } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<MembershipFormSchema>({
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

    const onSubmit = async (values: MembershipFormSchema) => {
        try {
            onFormSubmit?.(values)
        } catch (error) {
            console.error('Error creating membership:', error)
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
                <OverviewSection control={control} errors={errors} />
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default MembershipForm
