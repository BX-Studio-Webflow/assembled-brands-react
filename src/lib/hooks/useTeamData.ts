import useSWR from 'swr'
import {
    apiGetMyTeams,
    apiGetTeamInvitations,
} from '@/services/TeamService'
import { swrKeys } from '@/lib/swr/keys'

export function useMyTeams() {
    return useSWR(swrKeys.myTeams, apiGetMyTeams)
}

export function useTeamInvitations() {
    return useSWR(swrKeys.teamInvitations, apiGetTeamInvitations)
}
