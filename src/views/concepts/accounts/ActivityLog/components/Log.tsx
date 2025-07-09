import Timeline from '@/components/ui/Timeline'
import { ActivityAvatar, ActivityEvent } from '@/components/view/Activity'
import isEmpty from 'lodash/isEmpty'
import type { Activity } from '../types'

type LogProps = {
    activities: Activity[]
    filter: string[]
}

export const Log = ({ activities, filter = [] }: LogProps) => {
    return (
        <div>
            <Timeline>
                {isEmpty(activities) ? (
                    <Timeline.Item>No Activities</Timeline.Item>
                ) : (
                    activities
                        .filter((log) =>
                            log.events.some((item) =>
                                filter.includes(item.type),
                            ),
                        )
                        .map((log, logIndex) =>
                            log.events
                                .filter((item) => filter.includes(item.type))
                                .map((event, eventIndex) => (
                                    <Timeline.Item
                                        key={
                                            log.id +
                                            event.type +
                                            logIndex +
                                            eventIndex
                                        }
                                        media={<ActivityAvatar data={event} />}
                                    >
                                        <div className="mt-1">
                                            <ActivityEvent data={event} />
                                        </div>
                                    </Timeline.Item>
                                )),
                        )
                )}
            </Timeline>
        </div>
    )
}
