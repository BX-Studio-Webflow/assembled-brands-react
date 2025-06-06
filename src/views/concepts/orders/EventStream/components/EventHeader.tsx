import { useParams } from 'react-router'

const EventHeader = () => {
    const { id } = useParams()

    return <h3>Event: #{id}</h3>
}

export default EventHeader
