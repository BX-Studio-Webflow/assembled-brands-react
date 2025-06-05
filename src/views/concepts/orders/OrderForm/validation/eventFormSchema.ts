import { z } from 'zod'
import { EventDetailsSchema } from './eventDetailsSchema'
import { MembershipPlansSchema } from './membershipPlanSchema'
import { OtherEventDetailsSchema } from './otherEventDetailsSchema'

export const EventFormSchema = EventDetailsSchema.merge(
    MembershipPlansSchema,
).merge(OtherEventDetailsSchema)

export type EventFormType = z.infer<typeof EventFormSchema>
