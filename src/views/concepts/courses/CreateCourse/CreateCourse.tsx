import useSWR from 'swr'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useTasksStore } from './store/tasksStore'
import {
    apiGetProjectTasks,
    apiGetProjectMembers,
} from '@/services/ProjectService'
import type { GetModulesResponse, GetProjectMembersResponse } from './types'
import Setting from './components/Setting'

const CreateCourse = () => {
    const {
        updateOrdered,
        updateGroups,
        updateBoardMembers,
        updateAllMembers,
    } = useTasksStore()

    useSWR(
        ['/api/projects/tasks'],
        () => apiGetProjectTasks<GetModulesResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            onSuccess: (data) => {
                updateOrdered(Object.keys(data))
                updateGroups(data)
            },
        },
    )

    useSWR(
        ['/api/projects/task/members'],
        () => apiGetProjectMembers<GetProjectMembersResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            onSuccess: (data) => {
                updateBoardMembers(data.participantMembers)
                updateAllMembers(data.allMembers)
            },
        },
    )

    return (
        <AdaptiveCard>
            <Setting />
        </AdaptiveCard>
    )
}

export default CreateCourse
