import { useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { TbTrash } from 'react-icons/tb'
import useSWR from 'swr'
import EmailDialog from '@/components/view/EmailDialog/EmailDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import type {
    MyTeam,
    TeamMember,
    TeamInvitation,
    MyInvitation,
} from '@/@types/team'
import {
    apiGetTeamDashboard,
    apiAcceptTeamInvitation,
    apiRejectTeamInvitation,
    apiRevokeTeamMember,
    apiDeleteTeamInvitation,
    apiInviteTeamMember,
} from '@/services/TeamService'
import { AxiosError } from 'axios'
import { HiMail } from 'react-icons/hi'

type InviteUser = {
    email: string
}

type RevokeDialogState = {
    isOpen: boolean
    type: 'member' | 'invitation'
    title: string
    message: string
    teamId?: number
    memberId?: number
    invitationId?: number
}

const SettingsTeam = () => {
    const [inviteDialog, setInviteDialog] = useState<{
        open: boolean
        defaultValues: InviteUser
    }>({
        open: false,
        defaultValues: {
            email: '',
        },
    })

    const [revokeDialog, setRevokeDialog] = useState<RevokeDialogState>({
        isOpen: false,
        type: 'member',
        title: '',
        message: '',
    })

    const {
        data = {
            my_teams: [],
            team_members: { team_id: 0, team_name: '', members: [] },
            my_invitations: [],
            team_invitations: [],
        },
        mutate,
    } = useSWR('/team/dashboard', () => apiGetTeamDashboard(), {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    })

    const handleInviteSubmit = async (values: InviteUser) => {
        try {
            await apiInviteTeamMember(values.email, data.team_members.team_id)
            toast.push(
                <Notification type="success">
                    Invitation sent successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate() // Refresh the data
            setInviteDialog({
                open: false,
                defaultValues: { email: '' },
            })
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleAcceptInvitation = async (invitationId: number) => {
        try {
            await apiAcceptTeamInvitation(invitationId)
            toast.push(
                <Notification type="success">
                    Invitation accepted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate() // Refresh the data
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleRejectInvitation = async (invitationId: number) => {
        try {
            await apiRejectTeamInvitation(invitationId)
            toast.push(
                <Notification type="success">
                    Invitation rejected successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate() // Refresh the data
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleRevokeMember = (
        teamId: number,
        memberId: number,
        memberName: string,
    ) => {
        setRevokeDialog({
            isOpen: true,
            type: 'member',
            title: 'Remove Team Member',
            message: `Are you sure you want to remove ${memberName} from the team? This action can't be undone.`,
            teamId,
            memberId,
        })
    }

    const handleRevokeInvitation = (
        invitationId: number,
        inviteeEmail: string,
    ) => {
        setRevokeDialog({
            isOpen: true,
            type: 'invitation',
            title: 'Cancel Team Invitation',
            message: `Are you sure you want to cancel the invitation sent to ${inviteeEmail}? This action can't be undone.`,
            invitationId,
        })
    }

    const handleConfirmRevoke = async () => {
        try {
            if (
                revokeDialog.type === 'member' &&
                revokeDialog.teamId &&
                revokeDialog.memberId
            ) {
                await apiRevokeTeamMember(
                    revokeDialog.teamId,
                    revokeDialog.memberId,
                )
                toast.push(
                    <Notification type="success">
                        Team member removed successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
            } else if (
                revokeDialog.type === 'invitation' &&
                revokeDialog.invitationId
            ) {
                await apiDeleteTeamInvitation(revokeDialog.invitationId)
                toast.push(
                    <Notification type="success">
                        Invitation cancelled successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
            mutate() // Refresh the data
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setRevokeDialog({
                isOpen: false,
                type: 'member',
                title: '',
                message: '',
            })
        }
    }

    const handleCancelRevoke = () => {
        setRevokeDialog({
            isOpen: false,
            type: 'member',
            title: '',
            message: '',
        })
    }

    return (
        <div>
            <h4 className="mb-4">Teams</h4>

            {/* My Teams Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h5>My Teams</h5>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                    {data &&
                        data?.my_teams &&
                        data?.my_teams?.map((team: MyTeam, index: number) => (
                            <div
                                key={team.team_id}
                                className={classNames(
                                    'flex items-center justify-between p-4',
                                    !isLastChild(data.my_teams, index) &&
                                        'border-b border-gray-200 dark:border-gray-600',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={team.business.logo}
                                        alt={team.team_name}
                                        size={40}
                                    />
                                    <div>
                                        <div className="font-semibold">
                                            {team.team_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {team.business.email}
                                        </div>
                                    </div>
                                </div>
                                <Tag className="capitalize">{team.role}</Tag>
                            </div>
                        ))}
                </div>
            </div>

            {/* Team Members Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h5>Team Members</h5>
                    <Button
                        className="mr-2"
                        icon={<HiMail />}
                        onClick={() => {
                            setInviteDialog({
                                open: true,
                                defaultValues: { email: '' },
                            })
                        }}
                    >
                        <span>
                            <span>Send Invitation</span>
                        </span>
                    </Button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                    {data &&
                        data?.team_members &&
                        data?.team_members?.members?.map(
                            (member: TeamMember, index: number) => (
                                <div
                                    key={member.memberId}
                                    className={classNames(
                                        'flex items-center justify-between p-4',
                                        !isLastChild(
                                            data.team_members.members,
                                            index,
                                        ) &&
                                            'border-b border-gray-200 dark:border-gray-600',
                                    )}
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {member.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {member.email}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag
                                            className={classNames(
                                                'capitalize',
                                                member.role === 'host'
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded'
                                                    : 'text-white bg-indigo-600 border-0',
                                            )}
                                        >
                                            {member.role}
                                        </Tag>
                                        <Button
                                            size="sm"
                                            icon={<TbTrash />}
                                            onClick={() =>
                                                handleRevokeMember(
                                                    data.team_members.team_id,
                                                    member.memberId,
                                                    member.name,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                </div>
            </div>

            {/* Team Invitations Section */}
            {data &&
                data?.team_invitations &&
                data?.team_invitations?.length > 0 && (
                    <div className="mb-8">
                        <h5 className="mb-4">Sent Team Invitations</h5>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                            {data.team_invitations.map(
                                (invitation: TeamInvitation, index: number) => (
                                    <div
                                        key={invitation.id}
                                        className={classNames(
                                            'flex items-center justify-between p-4',
                                            !isLastChild(
                                                data.team_invitations,
                                                index,
                                            ) &&
                                                'border-b border-gray-200 dark:border-gray-600',
                                        )}
                                    >
                                        <div>
                                            <div className="font-semibold">
                                                {invitation.invitee_email}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Invited on{' '}
                                                {new Date(
                                                    invitation.created_at,
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag
                                                className={
                                                    invitation.status ===
                                                    'pending'
                                                        ? 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded'
                                                }
                                            >
                                                {invitation.status}
                                            </Tag>
                                            {invitation.status ===
                                                'pending' && (
                                                <Button
                                                    size="sm"
                                                    icon={<TbTrash />}
                                                    onClick={() =>
                                                        handleRevokeInvitation(
                                                            invitation.id,
                                                            invitation.invitee_email,
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}

            {/* My Invitations Section */}
            {data.my_invitations.length > 0 && (
                <div className="mb-8">
                    <h5 className="mb-4">My Invitations</h5>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                        {data.my_invitations.map(
                            (invitation: MyInvitation, index: number) => (
                                <div
                                    key={invitation.id}
                                    className={classNames(
                                        'flex items-center justify-between p-4',
                                        !isLastChild(
                                            data.my_invitations,
                                            index,
                                        ) &&
                                            'border-b border-gray-200 dark:border-gray-600',
                                    )}
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {invitation.team_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Invited by {invitation.inviter_name}{' '}
                                            ({invitation.inviter_email})
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() =>
                                                handleAcceptInvitation(
                                                    invitation.id,
                                                )
                                            }
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            icon={<TbTrash />}
                                            onClick={() =>
                                                handleRejectInvitation(
                                                    invitation.id,
                                                )
                                            }
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}

            <EmailDialog
                title="Invite Team Member"
                dialogOpen={inviteDialog.open}
                defaultValues={inviteDialog.defaultValues}
                onDialogClose={() =>
                    setInviteDialog({
                        open: false,
                        defaultValues: { email: '' },
                    })
                }
                onSubmit={handleInviteSubmit}
            />

            <ConfirmDialog
                isOpen={revokeDialog.isOpen}
                type="danger"
                title={revokeDialog.title}
                onClose={handleCancelRevoke}
                onRequestClose={handleCancelRevoke}
                onCancel={handleCancelRevoke}
                onConfirm={handleConfirmRevoke}
            >
                <p>{revokeDialog.message}</p>
            </ConfirmDialog>
        </div>
    )
}

export default SettingsTeam
