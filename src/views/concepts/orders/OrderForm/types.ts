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

type BaseOrderFormSchema = CustomerDetailsFields &
    BillingAddressFields &
    PaymentMethodFields

export type OrderFormSchema = BaseOrderFormSchema &
    (
        | GetPaymentMethodFields<'creditOrDebitCard'>
        | GetPaymentMethodFields<'paypal'>
        | GetPaymentMethodFields<'bankTransfer'>
        | GetPaymentMethodFields<''>
    )

export type FormSectionBaseProps = {
    control: Control<OrderFormSchema>
    errors: FieldErrors<OrderFormSchema>
}

export type EventFormType = {
    event_name: string
    event_description: string
    membership_plans: Array<{
        name: string
        isFree: boolean
        cost: number
        date: number
        payment_type: 'one_off' | 'recurring'
    }>
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    terms: boolean
    asset_id: number
    status: 'active' | 'suspended' | 'cancelled'
}
