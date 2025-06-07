import Card from '@/components/ui/Card'

type EventDetailNoteProps = {
    note: string
}

const EventDetailNote = ({ note }: EventDetailNoteProps) => {
    return (
        <Card>
            <h4 className="mb-4">Note</h4>
            <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-700 ">
                {note}
            </div>
        </Card>
    )
}

export default EventDetailNote
