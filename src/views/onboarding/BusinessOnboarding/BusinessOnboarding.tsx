import { useState, useMemo } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { components } from 'react-select'
import type { OptionProps, ControlProps } from 'react-select'
import { countryList } from '@/constants/countries.constant'
import { NumericInput } from '@/components/shared'
import { Avatar, toast } from '@/components/ui'
import type { BusinessDetails } from '@/@types/auth'
import Side from '@/components/layouts/AuthLayout/Side'
import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import { useThemeStore } from '@/store/themeStore'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'

const BeforeUpload = ({
    onFileSelect,
}: {
    onFileSelect: (base64: string, fileName: string) => void
}) => {
    const maxUpload = 1

    const beforeUpload = (files: FileList | null, fileList: File[]) => {
        if (!files || files.length === 0) {
            return 'Please select a file'
        }

        const file = files[0]

        if (fileList.length >= maxUpload) {
            return `You can only upload ${maxUpload} file(s)`
        }

        const allowedFileType = ['image/jpeg', 'image/png']
        if (!allowedFileType.includes(file.type)) {
            return 'Please upload a .jpeg or .png file!'
        }

        const maxFileSize = 500000
        if (file.size >= maxFileSize) {
            return 'Upload image cannot more then 500kb!'
        }

        // Process the file if all validations pass
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result as string
            onFileSelect(base64, file.name)
        }
        reader.readAsDataURL(file)

        return true
    }

    const tip = <p className="mt-2">jpeg or png only (max 500kb)</p>

    return (
        <div>
            <Upload
                beforeUpload={beforeUpload}
                uploadLimit={maxUpload}
                tip={tip}
            />
        </div>
    )
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

const BusinessOnboarding = () => {
    const [message, setMessage] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    const [logoBase64, setLogoBase64] = useState('')
    const [logoFileName, setLogoFileName] = useState('')
    const { saveBusinessDetails } = useAuth()
    const mode = useThemeStore((state) => state.mode)
    const navigate = useNavigate()
    const handleFileSelect = (base64: string, fileName: string) => {
        setLogoBase64(base64)
        setLogoFileName(fileName)
        setValue('logo', base64)
        setValue('logoFileName', fileName)
    }

    type BusinessOnboardingSchema = {
        name: string
        address: string
        phone: string
        dial_code: string
        email: string
        description: string
        logo: string
        logoFileName: string
    }

    const validationSchema = z.object({
        name: z.string().min(1, 'Business name is required'),
        address: z.string().min(1, 'Business address is required'),
        phone: z.string().min(1, 'Phone number is required'),
        dial_code: z.string().min(1, 'Please select a dial code'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Please enter a valid email'),
        description: z.string().min(1, 'Business description is required'),
        logo: z.string().min(1, 'Business logo is required'),
        logoFileName: z.string().min(1, 'Business logo file name is required'),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
    } = useForm<BusinessOnboardingSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            dial_code: '',
            email: '',
            description: '',
            logo: '',
            logoFileName: '',
        },
    })

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )
        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const onSubmit = async (values: BusinessOnboardingSchema) => {
        try {
            const formData: BusinessDetails = {
                ...values,
                logo: logoBase64 || '',
                logoFileName: logoFileName || '',
            }

            if (!logoBase64 || !logoFileName) {
                setMessage('Please upload a logo')
                return
            }

            setSubmitting(true)
            const result = await saveBusinessDetails(formData)

            if (result?.status === 'failed') {
                setMessage(result.message)
            }

            toast.push(
                <Notification type="success">Business onboarded!</Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/onboarding/pricing')
            setSubmitting(false)
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    return (
        <Side>
            <>
                <div className="mb-8">
                    <Logo
                        type="streamline"
                        mode={mode}
                        imgClass="mx-auto"
                        logoWidth={60}
                    />
                </div>
                <div className="mb-8">
                    <h3 className="mb-1">Business Onboarding</h3>
                    <p className="font-semibold heading-text">
                        Complete your business profile
                    </p>
                </div>
                {message && (
                    <Alert showIcon className="mb-4" type="danger">
                        <span className="break-all">{message}</span>
                    </Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Business Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Business Name"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Business Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Business Email"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex items-end gap-4 w-full">
                        <FormItem invalid={Boolean(errors.dial_code)}>
                            <label className="form-label mb-2">Dial Code</label>
                            <Controller
                                name="dial_code"
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
                            invalid={Boolean(errors.phone)}
                            errorMessage={errors.phone?.message}
                        >
                            <label className="form-label mb-2">
                                Business Phone
                            </label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <NumericInput
                                        type="tel"
                                        autoComplete="off"
                                        placeholder="Business Phone"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <FormItem
                        label="Business Address"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Business Address"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Business Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Business Description"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Business Logo" className="mb-4">
                        <BeforeUpload onFileSelect={handleFileSelect} />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Business Details'}
                    </Button>
                </Form>
            </>
        </Side>
    )
}

export default BusinessOnboarding
