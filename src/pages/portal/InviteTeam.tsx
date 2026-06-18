import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import Badge from '@/components/ui/Badge'
import { INVITE_ROLES } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'

const emptyForm = { fullName: '', email: '', role: '', message: '' }

export default function InviteTeam() {
    const members = useApplicationStore((s) => s.members)
    const addMember = useApplicationStore((s) => s.addMember)
    const [form, setForm] = useState(emptyForm)

    const canSubmit = form.fullName.trim() && form.email.trim() && form.role

    function submit() {
        if (!canSubmit) return
        addMember({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            role: form.role,
            message: form.message.trim(),
        })
        setForm(emptyForm)
    }

    return (
        <>
            <PageHeader title="Invite Team Members" />

            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit()
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

                    <div className="flex flex-wrap items-center justify-end gap-[15px]">
                        <button
                            type="button"
                            disabled={!canSubmit}
                            className="ab-label border-b border-ink text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={submit}
                        >
                            + Add another member
                        </button>
                        <PillButton
                            type="submit"
                            variant={canSubmit ? 'stack' : 'muted'}
                            disabled={!canSubmit}
                        >
                            Send invite
                        </PillButton>
                    </div>
                </form>
            </PortalCard>

            {members.length > 0 && (
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
                                {members.map((m) => (
                                    <tr
                                        key={m.id}
                                        className="border-b border-ink/10 last:border-0"
                                    >
                                        <td className="ab-text-m px-6 py-4 text-ink">
                                            {m.fullName}
                                        </td>
                                        <td className="ab-text-m px-6 py-4 text-ink/70">
                                            {m.email}
                                        </td>
                                        <td className="ab-text-m px-6 py-4 text-ink/70">
                                            {m.role}
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
