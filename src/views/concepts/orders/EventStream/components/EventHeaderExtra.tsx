import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'

const EventHeaderExtra = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const handleUpgradeClick = () => {
        navigate(`/concepts/orders/order-edit/${id}`)
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-green-400 hover:bg-green-500 text-white'
                }
                onClick={() => window.print()}
            >
                Instant Call Back
            </Button>
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-teal-400 hover:bg-teal-500 text-white'
                }
                onClick={() => window.print()}
            >
                Schedule a Call Back
            </Button>
            <Button
                variant="solid"
                customColorClass={() =>
                    'bg-amber-400 hover:bg-amber-500 text-white'
                }
                onClick={() => handleUpgradeClick()}
            >
                Upgrade Now
            </Button>
        </div>
    )
}

export default EventHeaderExtra
