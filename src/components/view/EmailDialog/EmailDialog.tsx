import { useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'

type InviteUser = {
    email: string
}

type FormSchema = InviteUser

type EmailDialogProps = {
    title: string
    dialogOpen: boolean
    onDialogClose: () => void
    defaultValues: InviteUser
    onSubmit: (value: FormSchema) => void
}

const validationSchema: ZodType<FormSchema> = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),
})

const EmailDialog = ({
    title,
    dialogOpen,
    onDialogClose,
    defaultValues,
    onSubmit,
}: EmailDialogProps) => {
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
    } = useForm<FormSchema>({
        defaultValues,
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        reset(defaultValues)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues])

    return (
        <Dialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <h4>{title}</h4>
            <Form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Email Address"
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
                                placeholder="Enter email address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    variant="solid"
                    type="submit"
                    loading={isSubmitting}
                >
                    Send Invitation
                </Button>
            </Form>
        </Dialog>
    )
}

export default EmailDialog
