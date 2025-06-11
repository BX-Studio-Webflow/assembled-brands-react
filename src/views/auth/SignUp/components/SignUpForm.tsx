import { useState, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import type { CommonProps } from '@/@types/common'
import { useNavigate } from 'react-router'
import { ONBOARDING_PREFIX_PATH } from '@/constants/route.constant'
import { NumericInput } from '@/components/shared'
import { Avatar } from '@/components/ui'
import type { OptionProps, ControlProps } from 'react-select'
import { components } from 'react-select'
import { countryList } from '@/constants/countries.constant'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    name: string
    password: string
    email: string
    phoneNumber: string
    dialCode: string
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

const validationSchema: ZodType<SignUpFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .email('Please enter a valid email'),
    name: z
        .string({ required_error: 'Please enter your name' })
        .min(2, 'Name must be at least 2 characters'),
    password: z
        .string({ required_error: 'Password Required' })
        .min(6, 'Password must be at least 6 characters'),
    phoneNumber: z
        .string({ required_error: 'Please enter your phone number' })
        .min(10, 'Phone number must be at least 10 digits'),
    dialCode: z.string({ required_error: 'Please select a dial code' }),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props
    const navigate = useNavigate()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )
        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            dialCode: '',
        },
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        const { name, password, email, phoneNumber, dialCode } = values
        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({
                name,
                password,
                email,
                dial_code: dialCode,
                phone: `${phoneNumber}`,
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else if (result?.status === 'success') {
                navigate(`${ONBOARDING_PREFIX_PATH}/business-onboarding`)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Name"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
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
                                placeholder="Email"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="flex items-end gap-4 w-full">
                    <FormItem invalid={Boolean(errors.dialCode)}>
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
                                        (option) =>
                                            option.dialCode === field.value,
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
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
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
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
