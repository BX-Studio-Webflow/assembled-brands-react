import type { Control, FieldErrors } from 'react-hook-form'

export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    price: number
    stock: number
}

export type Products = Product[]

export type GetProductListResponse = {
    list: Product[]
    total: number
}

export type ProductOption = {
    label: string
    img: string
    quantity: number
    value: string
}

export type SelectedProduct = Product & { quantity: number }

export type CustomerDetailsFields = {
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
}

export type BillingAddressFields = {
    country: string
    address: string
    postcode: string
    city: string
}

export type PaymentType = 'creditOrDebitCard' | 'paypal' | 'bankTransfer' | ''

export type GetPaymentMethodFields<T extends PaymentType> =
    T extends 'creditOrDebitCard'
        ? {
              cardHolderName: string
              ccNumber: string
              cardExpiry: string
              code: string
          }
        : T extends 'paypal'
          ? { paypalEmail: string }
          : T extends 'bankTransfer'
            ? {
                  accountHolderName: string
                  bankName: string
                  accountNumber: string
                  IBAN: string
                  referenceNumber: string
              }
            : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              {}

export interface PaymentMethodFields {
    paymentMethod: PaymentType
}

type BaseEventFormSchema = CustomerDetailsFields &
    BillingAddressFields &
    PaymentMethodFields

export type EventFormSchema = BaseEventFormSchema &
    (
        | GetPaymentMethodFields<'creditOrDebitCard'>
        | GetPaymentMethodFields<'paypal'>
        | GetPaymentMethodFields<'bankTransfer'>
        | GetPaymentMethodFields<''>
    )

export type FormSectionBaseProps = {
    control: Control<EventFormSchema>
    errors: FieldErrors<EventFormSchema>
}

export type EventFormType = {
    event_name: string
    event_description: string
    membership_plans: Array<{
        name: string
        isFree: boolean
        cost: number
        date: number | Date
        payment_type: 'one_off' | 'recurring'
        id?: number
    }>
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    terms: true
    asset_id: number
    status: 'active' | 'suspended' | 'cancelled'
    instructions?: string
    landing_page_url?: string
    success_url?: string
    calendar_url?: string
    asset?: { value: string; label: string; color: string }
    live_video_url?: string
    live_venue_address?: string
    course_url_external?: string
    course_internal?: boolean
    invite_existing_leads?: boolean
}
