import { z } from 'zod'

const MembershipPlanSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Plan name is required'),
    date: z.union([z.date(), z.number()]),
    payment_type: z.enum(['one_off', 'recurring']),
    cost: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'Cost is required'),
    ),
    isFree: z.boolean().default(false),
})

export const EventFormSchema = z
    .object({
        // Event Details
        event_name: z.string().min(1, 'Event name is required'),
        event_description: z.string().min(1, 'Description is required'),
        image_asset_id: z.preprocess((val) => Number(val), z.number()),

        // Membership Plans
        membership_plans: z
            .array(MembershipPlanSchema)
            .min(1, 'At least one plan is required')
            .default([
                {
                    name: '',
                    isFree: false,
                    cost: 0,
                    date: new Date(),
                    payment_type: 'one_off',
                },
            ]),

        // Other Event Details
        instructions: z.string().optional(),
        landing_page_url: z.string().optional(),
        asset_id: z.preprocess((val) => Number(val), z.number()),
        event_type: z.enum(['live_venue', 'prerecorded', 'live_video_call']),
        status: z.enum(['active', 'suspended', 'cancelled']),
        live_video_url: z.string().optional(),
        calendar_url: z.string().optional(),
        live_venue_address: z.string().optional(),
        success_url: z.string().optional(),
        upgrade_url: z.string().optional(),
        course_url_external: z.string().optional(),
        course_internal: z.boolean().optional(),
        invite_existing_leads: z.boolean().optional(),
        terms: z.literal(true, {
            errorMap: () => ({ message: 'You must accept terms' }),
        }),
    })
    .superRefine((data, ctx) => {
        if (data.event_type === 'prerecorded' && !data.asset_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please select an asset.',
                path: ['asset_id'],
            })
        }
        if (data.event_type === 'live_venue' && !data.live_venue_address) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a live venue address.',
                path: ['live_venue_address'],
            })
        }
        if (data.event_type === 'live_video_call' && !data.live_video_url) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please enter a live video call URL.',
                path: ['live_video_url'],
            })
        }
    })

export type EventFormType = z.infer<typeof EventFormSchema>
