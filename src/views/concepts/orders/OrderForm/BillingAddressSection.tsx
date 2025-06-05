// Minimal event form schema for this section
interface MembershipPlan {
    name: string
    isFree?: boolean
    cost?: number
    date: number | Date
    payment_type: 'one_off' | 'recurring'
}
interface EventFormSchema {
    membership_plans: MembershipPlan[]
}
;<FormItem
    label="Start date/time of this plan"
    invalid={Boolean(errors.membership_plans?.[idx]?.date)}
    errorMessage={errors.membership_plans?.[idx]?.date?.message}
>
    <Controller
        name={`membership_plans.${idx}.date` as const}
        control={control}
        render={({ field }) => (
            <DateTimepicker
                placeholder="Pick date & time"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.getTime() : 0)}
            />
        )}
    />
</FormItem>
