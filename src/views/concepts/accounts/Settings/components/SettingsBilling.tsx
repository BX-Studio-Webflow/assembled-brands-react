import Button from '@/components/ui/Button'
import BillingHistory from './BillingHistory'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import useSWR from 'swr'

import type { GetSettingsBillingResponse } from '../types'
import { apiGetStripeSubscriptions } from '@/services/AuthService'
import FileNotFound from '@/assets/svg/FileNotFound'

const SettingsBilling = () => {
    const {
        data = {
            data: {
                subscriptions: [],
                cardDetails: [],
            },
        },
    } = useSWR(
        '/subscription',
        () => apiGetStripeSubscriptions<GetSettingsBillingResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <div>
            <h4 className="mb-4">Billing & Payments</h4>

            <div className="mt-8">
                <h5>Payment method</h5>
                {data.data.cardDetails.length === 0 ? (
                    <div className="flex flex-col items-center gap-4">
                        <FileNotFound />
                        <span className="font-semibold">
                            No payment method found!
                        </span>
                    </div>
                ) : (
                    <div>
                        {data.data.cardDetails?.map((card, index) => (
                            <div
                                key={card.id}
                                className={classNames(
                                    'flex items-center justify-between p-4',
                                    !isLastChild(
                                        data.data.cardDetails,
                                        index,
                                    ) &&
                                        'border-b border-gray-200 dark:border-gray-600',
                                )}
                            >
                                <div className="flex items-center">
                                    {card.card.brand === 'visa' && (
                                        <img
                                            src="/img/others/img-8.png"
                                            alt="visa"
                                        />
                                    )}
                                    {card.card.brand === 'mastercard' && (
                                        <img
                                            src="/img/others/img-9.png"
                                            alt="master"
                                        />
                                    )}
                                    <div className="ml-3 rtl:mr-3">
                                        <div className="flex items-center">
                                            <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {card.billing_details.name} ••••{' '}
                                                {card.card.last4}
                                            </div>
                                        </div>
                                        <span>
                                            Expires {card.card.exp_month}/
                                            {card.card.exp_year}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {}}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h5>Transaction history</h5>
                <BillingHistory
                    className="mt-4"
                    data={data.data.subscriptions.map((sub) => ({
                        id: sub.id.toString(),
                        item: sub.object,
                        status: sub.payment_status,
                        amount: sub.amount_total,
                        date: sub.created,
                    }))}
                />
            </div>
        </div>
    )
}

export default SettingsBilling
