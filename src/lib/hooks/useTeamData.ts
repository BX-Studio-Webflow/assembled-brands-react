import useSWR from 'swr'
import { apiGetMyTeams, apiGetTeamInvitations } from '@/services/TeamService'
import type { TeamInvitation } from '@/types/team'
import { swrKeys } from '@/lib/swr/keys'

export async function fetchTeamInvitations(): Promise<TeamInvitation[]> {
    const data = await apiGetTeamInvitations()
    return Array.isArray(data) ? data : []
}

export function useMyTeams() {
    return useSWR(swrKeys.myTeams, apiGetMyTeams)
}

export function useTeamInvitations() {
    return useSWR(swrKeys.teamInvitations, fetchTeamInvitations)
}
