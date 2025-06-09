import { z } from 'zod'

export const MembershipPlanSchema = z.object({
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

export const MembershipPlansSchema = z.object({
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
})
