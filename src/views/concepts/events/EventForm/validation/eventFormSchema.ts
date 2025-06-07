import { z } from 'zod'
import { EventDetailsSchema } from './eventDetailsSchema'
import { MembershipPlansSchema } from './membershipPlanSchema'
import { OtherEventDetailsSchema } from './otherEventDetailsSchema'

export const EventFormSchema = EventDetailsSchema.merge(MembershipPlansSchema)
    .merge(OtherEventDetailsSchema)
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
