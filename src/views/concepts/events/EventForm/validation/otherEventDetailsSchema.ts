import { z } from 'zod'

export const OtherEventDetailsSchema = z.object({
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
