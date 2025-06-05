import { z } from 'zod'

export const EventDetailsSchema = z.object({
    event_name: z.string().min(1, 'Event name is required'),
    event_description: z.string().min(1, 'Description is required'),
})
