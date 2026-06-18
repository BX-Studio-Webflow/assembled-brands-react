import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import Badge from '@/components/ui/Badge'
import InviteTeamSkeleton from '@/components/skeletons/InviteTeamSkeleton'
import { INVITE_ROLES } from '@/constants/options'
import { useMyTeams, useTeamInvitations } from '@/lib/hooks/useTeamData'
import { revalidateTeamInvitations } from '@/lib/swr/mutate'
import { apiInviteTeamMember } from '@/services/TeamService'
import { isValidEmail } from '@/lib/routing/postLogin'

const NOT_HOST_MESSAGE = 'You are not a host of any team'

type InviteForm = {
    fullName: string
    role: string
    message: string
    emails: string[]
}

const emptyForm = (): InviteForm => ({
    fullName: '',
    role: '',
    message: '',
    emails: [''],
})

function getErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: string }).message)
    }
    return ''
}

function inviteStatusTone(status: string): 'pending' | 'active' | 'neutral' {
    const normalized = status.toLowerCase()
    if (normalized === 'accepted') return 'active'
    if (normalized === 'pending') return 'pending'
    return 'neutral'
}

export default function InviteTeam() {
    const { data: teams, isLoading: teamsLoading } = useMyTeams()
    const {
        data: invitations = [],
        error: invitationsError,
        isLoading: invitesLoading,
    } = useTeamInvitations()
    const [form, setForm] = useState<InviteForm>(emptyForm)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const hostTeam = teams?.find((t) => t.role === 'host') ?? null
    const teamId = hostTeam?.team_id ?? null
    const loading = teamsLoading || invitesLoading

    const notHost =
        getErrorMessage(invitationsError) === NOT_HOST_MESSAGE ||
        (!teamsLoading && teams !== undefined && !hostTeam)

    const hasInvites = invitations.length > 0
    const displayForm = !notHost && (showForm || !hasInvites)
    const displayTable = !notHost && hasInvites && !showForm

    function patchForm(patch: Partial<InviteForm>) {
        setForm((prev) => ({ ...prev, ...patch }))
    }

    function patchEmail(index: number, value: string) {
        setForm((prev) => ({
            ...prev,
            emails: prev.emails.map((email, i) => (i === index ? value : email)),
        }))
    }

    function addEmailRow() {
        setForm((prev) => ({ ...prev, emails: [...prev.emails, ''] }))
    }

    async function submit() {
        setError(null)
        setSuccess(false)

        if (!form.fullName.trim()) {
            setError('Full name is required')
            return
        }
        if (!form.role) {
            setError('Role is required')
            return
        }
        if (!teamId) {
            setError('No team found. Please create a team first.')
            return
        }

        const emailsToSend = form.emails.map((e) => e.trim()).filter(Boolean)
        if (emailsToSend.length === 0) {
            setError('Please provide at least one email')
            return
        }

        const invalidEmail = emailsToSend.find((e) => !isValidEmail(e))
        if (invalidEmail) {
            setError('Please enter a valid email address')
            return
        }

        setSubmitting(true)
        try {
            await Promise.all(
                emailsToSend.map((email) =>
                    apiInviteTeamMember(
                        form.fullName.trim(),
                        form.role,
                        email,
                        teamId,
                        form.message.trim(),
                    ),
                ),
            )
            setForm(emptyForm())
            setShowForm(false)
            setSuccess(true)
            await revalidateTeamInvitations()
            window.setTimeout(() => setSuccess(false), 2000)
        } catch (err) {
            setError(
                getErrorMessage(err) || 'Failed to send invites. Please try again.',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <InviteTeamSkeleton />
    }

    if (notHost) {
        return (
            <>
                <PageHeader title="Invite Team Members" />
                <PortalCard>
                    <div className="mx-auto flex w-full max-w-[543px] flex-col gap-[15px]">
                        <h2 className="ab-h3">Limited access</h2>
                        <p className="ab-serif text-ink/70">
                            Only team hosts can invite new members. Contact your
                            team host if you need someone added to the workspace.
                        </p>
                    </div>
                </PortalCard>
            </>
        )
    }

    return (
        <>
            <PageHeader title="Invite Team Members" />

            {displayForm && (
                <PortalCard>
                    <form
                        className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                        onSubmit={(e) => {
                            e.preventDefault()
                            void submit()
                        }}
                    >
                        <Field label="Full name">
                            <TextField
                                variant="soft"
                                value={form.fullName}
                                onChange={(e) =>
                                    patchForm({ fullName: e.target.value })
                                }
                            />
                        </Field>

                        <div className="flex flex-col gap-[20px]">
                            {form.emails.map((email, index) => (
                                <Field
                                    key={index}
                                    label={index === 0 ? 'Email' : `Email ${index + 1}`}
                                >
                                    <TextField
                                        variant="soft"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            patchEmail(index, e.target.value)
                                        }
                                    />
                                </Field>
                            ))}
                        </div>

                        <Field label="Role">
                            <Select
                                options={INVITE_ROLES}
                                value={form.role}
                                placeholder="Select a role"
                                onChange={(v) => patchForm({ role: v })}
                            />
                        </Field>

                        <Field label="Invite Message (optional)">
                            <Textarea
                                value={form.message}
                                onChange={(e) =>
                                    patchForm({ message: e.target.value })
                                }
                            />
                        </Field>

                        {error && <p className="ab-text-m text-coral">{error}</p>}
                        {success && (
                            <p className="ab-text-m text-ink">
                                Invites sent successfully!
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-end gap-[15px]">
                            <button
                                type="button"
                                className="ab-label border-b border-ink text-ink"
                                onClick={addEmailRow}
                            >
                                + Add another member
                            </button>
                            <PillButton type="submit" loading={submitting}>
                                Send invite
                            </PillButton>
                        </div>
                    </form>
                </PortalCard>
            )}

            {displayTable && (
                <PortalCard className="overflow-hidden !px-0 !py-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-ink text-offwhite">
                                    <th className="ab-text-m px-6 py-4 font-medium">
                                        Name
                                    </th>
                                    <th className="ab-text-m px-6 py-4 font-medium">
                                        Email
                                    </th>
                                    <th className="ab-text-m px-6 py-4 font-medium">
                                        Role
                                    </th>
                                    <th className="ab-text-m px-6 py-4 text-right font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((m) => (
                                    <tr
                                        key={m.id}
                                        className="border-b border-ink/10 last:border-0"
                                    >
                                        <td className="ab-text-m px-6 py-4 text-ink">
                                            {m.invitee_name || 'Unknown'}
                                        </td>
                                        <td className="ab-text-m px-6 py-4 text-ink/70">
                                            {m.invitee_email}
                                        </td>
                                        <td className="ab-text-m px-6 py-4 text-ink/70">
                                            {m.user_defined_role}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Badge tone={inviteStatusTone(m.status)}>
                                                {m.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end border-t border-ink/10 px-6 py-4">
                        <button
                            type="button"
                            className="ab-label border-b border-ink text-ink"
                            onClick={() => {
                                setError(null)
                                setSuccess(false)
                                setShowForm(true)
                            }}
                        >
                            + Invite another member
                        </button>
                    </div>
                </PortalCard>
            )}
        </>
    )
}
