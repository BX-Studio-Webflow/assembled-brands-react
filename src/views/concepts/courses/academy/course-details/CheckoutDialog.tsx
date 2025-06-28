import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import sleep from '@/utils/sleep'
import { TbCreditCard } from 'react-icons/tb'
import toast from '@/components/ui/toast'
import { Notification } from '@/components/ui/Notification'
import { useNavigate } from 'react-router'

interface CheckoutDialogProps {
    isOpen: boolean
    courseId: number
    courseTitle?: string
    onClose: () => void
}

const CheckoutDialog = ({
    isOpen,
    courseId,
    courseTitle = 'Course',
    onClose,
}: CheckoutDialogProps) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)

    const handleDialogClose = async () => {
        setPaymentSuccessful(false)
        await sleep(200)
        onClose()
    }

    const handlePayment = async () => {
        setLoading(true)
        try {
            // Simulate payment processing
            await sleep(2000)

            toast.push(
                <Notification type="success">
                    Payment processed successfully! You now have access to the
                    course.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )

            setPaymentSuccessful(true)

            // Navigate to course content after successful payment
            setTimeout(() => {
                navigate(
                    `/concepts/courses/academy/course-details/${courseId}?purchased=true`,
                )
                onClose()
            }, 2000)
        } catch {
            toast.push(
                <Notification type="danger">
                    Payment failed. Please try again.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            closable={!paymentSuccessful}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <>
                {!paymentSuccessful ? (
                    <>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">
                                Complete Your Purchase
                            </h3>
                            <p className="text-gray-600">
                                Get instant access to &ldquo;{courseTitle}
                                &rdquo;
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 mb-6">
                            <div className="text-sm text-gray-500 mb-1">
                                A simple start for everyone
                            </div>
                            <div className="flex items-end mb-2">
                                <span className="text-4xl font-bold text-gray-900 mr-2">
                                    $59.99
                                </span>
                                <span className="text-base text-gray-500 mb-1">
                                    /month
                                </span>
                            </div>
                        </div>
                        <Button
                            className="mb-2 w-full"
                            variant="solid"
                            loading={loading}
                            icon={<TbCreditCard />}
                            onClick={handlePayment}
                        >
                            <span>Proceed With Payment</span>
                        </Button>

                        <p className="text-xs text-gray-400 text-center">
                            By continuing, you accept to our Terms of Services
                            and Privacy Policy. Please note that payments are
                            non-refundable.
                        </p>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h3 className="text-xl font-bold mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-gray-600">
                            You now have access to &ldquo;{courseTitle}&rdquo;.
                            Redirecting you to the course...
                        </p>
                    </div>
                )}
            </>
        </Dialog>
    )
}

export default CheckoutDialog
