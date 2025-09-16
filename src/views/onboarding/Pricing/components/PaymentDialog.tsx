import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Segment from '@/components/ui/Segment'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { usePricingStore } from '../store/pricingStore'
import { TbCheck } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router'
import { PaymentCycle } from '../types'
import { apiCreateSubscription } from '@/services/PaymentService'
import toast from '@/components/ui/toast'
import { AxiosError } from 'axios'
import Notification from '@/components/ui/Notification'
import { pricingPlansData } from '../constants'

const PaymentDialog = () => {
    const [loading, setLoading] = useState(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)

    const navigate = useNavigate()

    const { paymentDialog, setPaymentDialog, selectedPlan, setSelectedPlan } =
        usePricingStore()

    const handleDialogClose = async () => {
        setPaymentDialog(false)
        await sleep(200)
        setSelectedPlan({})
        setPaymentSuccessful(false)
    }

    const handlePaymentChange = (paymentCycle: PaymentCycle) => {
        setSelectedPlan({
            ...selectedPlan,
            paymentCycle,
        })
    }

    const handlePay = async () => {
        setLoading(true)
        try {
            const plan = pricingPlansData.plans.find(
                (p) => p.id === selectedPlan.planId,
            )

            if (!plan) {
                console.log({ plan, pricingPlansData, selectedPlan })
                throw new Error('Plan not found')
            }

            const env: 'production' | 'development' = 'production'

            if (!plan[env]) {
                console.log(plan)
                throw new Error('Invalid plan configuration')
            }
            const priceId = plan[env][
                `priceId${selectedPlan.paymentCycle === 'monthly' ? 'Monthly' : 'Annually'}`
            ] as string
            console.log({ priceId, plan })
            const result = await apiCreateSubscription({
                priceId,
                productId: plan[env].productId,
                successUrl: pricingPlansData.successUrl,
                cancelUrl: pricingPlansData.cancelUrl,
                product: plan.id as
                    | 'basic'
                    | 'popular'
                    | 'advanced'
                    | 'enterprise'
                    | 'subscription',
            })

            toast.push(
                <Notification type="success">
                    Please proceed to make the payment via stripe.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            window.open(result.data.url, '_blank')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
        setLoading(false)
        setPaymentSuccessful(true)
    }

    const handleManageSubscription = async () => {
        navigate('/concepts/account/settings?view=billing')
        await handleDialogClose()
    }

    return (
        <Dialog
            isOpen={paymentDialog}
            closable={!paymentSuccessful}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            {paymentSuccessful ? (
                <>
                    <div className="text-center mt-6 mb-2">
                        <div className="inline-flex rounded-full p-5 bg-success">
                            <TbCheck className="text-5xl text-white" />
                        </div>
                        <div className="mt-6">
                            <h4>
                                Continue to payment to complete your purchase!
                            </h4>
                            <p className="text-base max-w-[400px] mx-auto mt-4 leading-relaxed">
                                We&apos;ve sent you to a Stripe checkout page to
                                complete your purchase. You&apos;ll get an email
                                with your order details as soon as you complete
                                the payment.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-8">
                            <Button block onClick={handleManageSubscription}>
                                Manage subscription
                            </Button>
                            <Button
                                block
                                variant="solid"
                                onClick={handleDialogClose}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h4>{selectedPlan.planName} plan</h4>
                    <div className="mt-6">
                        <Segment
                            defaultValue={selectedPlan.paymentCycle}
                            className="gap-4 flex bg-transparent"
                            onChange={(value) =>
                                handlePaymentChange(value as PaymentCycle)
                            }
                        >
                            {Object.entries(selectedPlan.price || {}).map(
                                ([key, value]) => (
                                    <Segment.Item key={key} value={key}>
                                        {({ active, onSegmentItemClick }) => {
                                            return (
                                                <div
                                                    className={classNames(
                                                        'flex justify-between border rounded-xl border-gray-300 dark:border-gray-600 py-5 px-4 select-none ring-1 w-1/2',
                                                        active
                                                            ? 'ring-primary border-primary'
                                                            : 'ring-transparent bg-gray-100 dark:bg-gray-600',
                                                    )}
                                                    role="button"
                                                    onClick={onSegmentItemClick}
                                                >
                                                    <div>
                                                        <div className="heading-text mb-0.5">
                                                            Pay{' '}
                                                            {key === 'monthly'
                                                                ? 'monthly'
                                                                : 'anually'}
                                                        </div>
                                                        <span className="text-lg font-bold heading-text flex gap-0.5">
                                                            <NumericFormat
                                                                displayType="text"
                                                                value={value}
                                                                prefix={'£'}
                                                                thousandSeparator={
                                                                    true
                                                                }
                                                            />
                                                            <span>{'/'}</span>
                                                            <span>
                                                                {key ===
                                                                'monthly'
                                                                    ? 'month'
                                                                    : 'year'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {active && (
                                                        <TbCheck className="text-primary text-xl" />
                                                    )}
                                                </div>
                                            )
                                        }}
                                    </Segment.Item>
                                ),
                            )}
                        </Segment>
                    </div>

                    <div className="mt-6 flex flex-col items-end">
                        <h4>
                            <span>Bill now: </span>
                            <span>
                                <NumericFormat
                                    displayType="text"
                                    value={
                                        selectedPlan.price?.[
                                            selectedPlan.paymentCycle as PaymentCycle
                                        ]
                                    }
                                    prefix={'£'}
                                    thousandSeparator={true}
                                />
                            </span>
                        </h4>
                        <div className="  leading-none mt-2 opacity-80">
                            <small>
                                By clicking &quot;Pay&quot;, you agree to be
                                charged £
                                <span className="font-bold">
                                    {
                                        selectedPlan.price?.[
                                            selectedPlan.paymentCycle as PaymentCycle
                                        ]
                                    }
                                </span>{' '}
                                every month, you can cancel this subscription
                                any time. Terms and conditions of the website
                                apply. Thank you!
                            </small>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            block
                            variant="solid"
                            loading={loading}
                            onClick={handlePay}
                        >
                            Pay
                        </Button>
                    </div>
                </>
            )}
        </Dialog>
    )
}

export default PaymentDialog
