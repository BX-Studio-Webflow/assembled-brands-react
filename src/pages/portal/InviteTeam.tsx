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

const emptyForm = { fullName: '', email: '', role: '', message: '' }

export default function InviteTeam() {
    const { data: teams, isLoading: teamsLoading } = useMyTeams()
    const { data: invitations = [], isLoading: invitesLoading } =
        useTeamInvitations()
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const teamId = teams?.[0]?.team_id ?? null
    const canSubmit = form.fullName.trim() && form.email.trim() && form.role
    const loading = teamsLoading || invitesLoading

    async function submit() {
        if (!canSubmit) return
        if (!isValidEmail(form.email.trim())) {
            setError('Please enter a valid email')
            return
        }
        if (!teamId) {
            setError('Team not found')
            return
        }

        setError(null)
        setSubmitting(true)
        try {
            await apiInviteTeamMember(
                form.fullName.trim(),
                form.role,
                form.email.trim(),
                teamId,
                form.message.trim(),
            )
            setForm(emptyForm)
            await revalidateTeamInvitations()
        } catch (err) {
            setError(
                (err as { message?: string }).message ?? 'Unable to send invite',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <InviteTeamSkeleton />
    }

    return (
        <>
            <PageHeader title="Invite Team Members" />

            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        void submit()
                    }}
                >
                    <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2">
                        <Field label="Full name">
                            <TextField
                                variant="soft"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({ ...form, fullName: e.target.value })
                                }
                            />
                        </Field>
                        <Field label="Email">
                            <TextField
                                variant="soft"
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </Field>
                    </div>

                    <Field label="Role">
                        <Select
                            options={INVITE_ROLES}
                            value={form.role}
                            placeholder="Select a role"
                            onChange={(v) => setForm({ ...form, role: v })}
                        />
                    </Field>

                    <Field label="Invite Message (optional)">
                        <Textarea
                            value={form.message}
                            onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                            }
                        />
                    </Field>

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex flex-wrap items-center justify-end gap-[15px]">
                        <button
                            type="button"
                            disabled={!canSubmit || submitting}
                            className="ab-label border-b border-ink text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => void submit()}
                        >
                            + Add another member
                        </button>
                        <PillButton
                            type="submit"
                            variant={canSubmit ? 'stack' : 'muted'}
                            disabled={!canSubmit}
                            loading={submitting}
                        >
                            Send invite
                        </PillButton>
                    </div>
                </form>
            </PortalCard>

            {invitations.length > 0 && (
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
                                            <Badge tone="pending">
                                                {m.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PortalCard>
            )}
        </>
    )
}
