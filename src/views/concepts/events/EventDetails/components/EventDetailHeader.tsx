import { useParams } from 'react-router'

const EventDetailHeader = () => {
    const { id } = useParams()

    return <h3>Event: #{id}</h3>
}

export default EventDetailHeader
