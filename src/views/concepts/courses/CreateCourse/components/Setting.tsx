import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { FormItem, Form } from '@/components/ui/Form'
import useResponsive from '@/utils/hooks/useResponsive'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import ModuleList from './ModuleList'

type FormSchema = {
    course_name: string
    course_description: string
    instructions: string
    landing_page_url: string
    course_type: 'self_paced' | 'instructor_led'
    status: 'draft' | 'published' | 'archived'
}

const validationSchema: ZodType<FormSchema> = z.object({
    course_name: z.string().min(1, { message: 'Course name is required' }),
    course_description: z
        .string()
        .min(1, { message: 'Course description is required' }),
    instructions: z.string().min(1, { message: 'Instructions are required' }),
    landing_page_url: z.string().url({ message: 'Valid URL is required' }),
    course_type: z.enum(['self_paced', 'instructor_led']),
    status: z.enum(['draft', 'published', 'archived']),
})

const Setting = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            course_name: '',
            course_description: '',
            instructions: '',
            landing_page_url: '',
            course_type: 'self_paced',
            status: 'draft',
        },
        resolver: zodResolver(validationSchema),
    })

    const { smaller } = useResponsive()

    const onSubmit = (values: FormSchema) => {
        // TODO: Implement course creation logic
        console.log('Creating new course:', values)
    }

    return (
        <div>
            <Form
                layout={smaller.lg ? 'vertical' : 'horizontal'}
                labelWidth={250}
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormItem
                    label="Course Name"
                    invalid={Boolean(errors.course_name)}
                    errorMessage={errors.course_name?.message}
                >
                    <Controller
                        name="course_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="Enter course name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Course Description"
                    invalid={Boolean(errors.course_description)}
                    errorMessage={errors.course_description?.message}
                    className="items-start"
                >
                    <Controller
                        name="course_description"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value}
                                invalid={Boolean(errors.course_description)}
                                onChange={({ html }) => {
                                    field.onChange(html)
                                }}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Instructions"
                    invalid={Boolean(errors.instructions)}
                    errorMessage={errors.instructions?.message}
                    className="items-start"
                >
                    <Controller
                        name="instructions"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value}
                                invalid={Boolean(errors.instructions)}
                                onChange={({ html }) => {
                                    field.onChange(html)
                                }}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Landing Page URL"
                    invalid={Boolean(errors.landing_page_url)}
                    errorMessage={errors.landing_page_url?.message}
                >
                    <Controller
                        name="landing_page_url"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="https://example.com"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Course Type"
                    invalid={Boolean(errors.course_type)}
                    errorMessage={errors.course_type?.message}
                >
                    <Controller
                        name="course_type"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Switcher
                                    checked={field.value === 'instructor_led'}
                                    onChange={(val) =>
                                        field.onChange(
                                            val
                                                ? 'instructor_led'
                                                : 'self_paced',
                                        )
                                    }
                                />
                                <span className="font-semibold">
                                    {field.value === 'instructor_led'
                                        ? 'Instructor Led'
                                        : 'Self Paced'}
                                </span>
                            </div>
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Course Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Switcher
                                    checked={field.value === 'published'}
                                    onChange={(val) =>
                                        field.onChange(
                                            val ? 'published' : 'draft',
                                        )
                                    }
                                />
                                <span className="font-semibold">
                                    {field.value === 'published'
                                        ? 'Published'
                                        : 'Draft'}
                                </span>
                            </div>
                        )}
                    />
                </FormItem>
                <ModuleList />
                <div className="flex justify-end my-8">
                    <Button type="submit" variant="solid">
                        Create Course
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default Setting
