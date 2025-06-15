export interface Comment {
    id: string
    name: string
    src: string
    message: string
    date: number
}

export type Member = {
    id: string
    name: string
    img: string
}

export type Module = {
    id: string
    title: string
    description: string
}

export type Members = Member[]

export type Groups = Record<string, Module[]>

export type GetModulesResponse = Groups

export type GetProjectMembersResponse = {
    participantMembers: Members
    allMembers: Members
}
