import { useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CreditCardDialog from '@/components/view/CreditCardDialog'
import BillingHistory from './BillingHistory'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import sleep from '@/utils/sleep'
import { TbPlus } from 'react-icons/tb'
import useSWR from 'swr'
import { PiLightningFill } from 'react-icons/pi'

import type {
    GetSettingsBillingResponse,
    CreditCard,
    CreditCardInfo,
} from '../types'
import {
    apiGetStripeSubscriptions,
    apiInitateStripeConnect,
} from '@/services/AuthService'
import { useAuth } from '@/auth'
import { AxiosError } from 'axios'

type CardDetails = GetSettingsBillingResponse['data']['cardDetails'][0]

const SettingsBilling = () => {
    const { user } = useAuth()
    const [selectedCard, setSelectedCard] = useState<{
        type: 'NEW' | 'EDIT' | ''
        dialogOpen: boolean
        cardInfo: Partial<CreditCardInfo>
    }>({
        type: '',
        dialogOpen: false,
        cardInfo: {},
    })

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

    const handleEditCreditCard = (card: CardDetails) => {
        setSelectedCard({
            type: 'EDIT',
            dialogOpen: true,
            cardInfo: {
                cardHolderName: card.billing_details.name,
                cardType: card.card.brand.toUpperCase(),
                expMonth: card.card.exp_month.toString(),
                expYear: card.card.exp_year.toString(),
                last4Number: card.card.last4,
                primary: false,
            },
        })
    }

    const handleCreditCardDialogClose = () => {
        setSelectedCard({
            type: '',
            dialogOpen: false,
            cardInfo: {},
        })
    }

    const handleEditCreditCardSubmit = async () => {
        await sleep(500)
        handleCreditCardDialogClose()
        toast.push(
            <Notification type="success">Credit card updated!</Notification>,
            { placement: 'top-center' },
        )
    }

    const handleAddCreditCardSubmit = async (values: CreditCard) => {
        console.log('Submitted values', values)
        await sleep(500)
        handleCreditCardDialogClose()
        toast.push(
            <Notification type="success">Credit card added!</Notification>,
            { placement: 'top-center' },
        )
    }

    const handleStripeConnect = async () => {
        try {
            const response = await apiInitateStripeConnect()
            window.open(response.url, '_blank')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <div>
            <h4 className="mb-4">Billing</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <Avatar
                                className="bg-emerald-500"
                                shape="circle"
                                icon={<PiLightningFill />}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">Stripe</h6>
                                <Tag
                                    className={
                                        user?.stripe_account_id
                                            ? 'bg-success-subtle text-success rounded-md border-0'
                                            : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                                    }
                                >
                                    <span className="capitalize">
                                        {user?.stripe_account_id
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span>
                                </Tag>
                            </div>
                            <div className="font-semibold">
                                <span>
                                    {user?.stripe_account_id
                                        ? 'Connected'
                                        : 'Unconnected'}
                                </span>
                                <span> | </span>
                                <span>
                                    {user?.stripe_account_id
                                        ? 'All set to receive payouts'
                                        : 'Please link your account'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={handleStripeConnect}
                        >
                            Connect account
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h5>Payment method</h5>
                <div>
                    {data.data.cardDetails?.map((card, index) => (
                        <div
                            key={card.id}
                            className={classNames(
                                'flex items-center justify-between p-4',
                                !isLastChild(data.data.cardDetails, index) &&
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
                                    onClick={() => handleEditCreditCard(card)}
                                >
                                    Edit
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="plain"
                        icon={<TbPlus />}
                        onClick={() => {
                            setSelectedCard({
                                type: 'NEW',
                                dialogOpen: true,
                                cardInfo: {},
                            })
                        }}
                    >
                        Add payment method
                    </Button>
                </div>
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
            <CreditCardDialog
                title={
                    selectedCard.type === 'NEW'
                        ? 'Add credit card'
                        : 'Edit credit card'
                }
                defaultValues={selectedCard.cardInfo as CreditCard}
                dialogOpen={selectedCard.dialogOpen}
                onDialogClose={handleCreditCardDialogClose}
                onSubmit={
                    selectedCard.type === 'NEW'
                        ? (values) =>
                              handleAddCreditCardSubmit(values as CreditCard)
                        : handleEditCreditCardSubmit
                }
            />
        </div>
    )
}

export default SettingsBilling
