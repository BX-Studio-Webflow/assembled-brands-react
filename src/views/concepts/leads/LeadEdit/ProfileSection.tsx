import Button from '@/components/ui/Button'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import type { Lead } from '@/@types/lead'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

type ProfileSectionProps = {
    data: Lead
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold">{title}</span>
            <p className="heading-text font-bold">{value}</p>
        </div>
    )
}

const ProfileSection = ({ data }: ProfileSectionProps) => {
    const navigate = useNavigate()

    const handleSendMessage = () => {
        navigate('/concepts/mail')
    }

    return (
        <>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4">
                    <CustomerInfoField title="Email" value={data.email} />
                    <CustomerInfoField
                        title="Phone"
                        value={`${data.dial_code}${data.phone}`}
                    />
                    <CustomerInfoField
                        title="Created"
                        value={dayjs(data.created_at).format(
                            'DD MMM YYYY hh:mm A',
                        )}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <Button block variant="solid" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ProfileSection
