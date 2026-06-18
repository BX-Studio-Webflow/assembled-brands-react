import { useState } from 'react'
import { LuMail } from 'react-icons/lu'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Textarea from '@/components/ui/Textarea'
import PillButton from '@/components/ui/PillButton'
import { sleep } from '@/lib/utils'

export default function Support() {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        await sleep()
        setLoading(false)
        setSent(true)
        setSubject('')
        setMessage('')
    }

    return (
        <>
            <PageHeader
                title="Need Help?"
                subtitle="Contact Support"
            />

            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-3">
                <div className="flex flex-col gap-3 bg-beige p-[24px] md:col-span-3">
                    <LuMail className="size-6 text-coral" />
                    <p className="ab-serif text-ink">
                        Having trouble with your uploads or have a question about
                        the requested documents? Send our team an email at{' '}
                        <a
                            className="border-b border-ink text-ink"
                            href="mailto:sales@assembledbrands.com"
                        >
                            sales@assembledbrands.com
                        </a>
                        .
                    </p>
                </div>
            </div>

            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <h2 className="ab-h3">Send us a message</h2>

                    {sent && (
                        <div className="rounded-[4px] bg-softgreen px-4 py-3">
                            <p className="ab-text-m text-ink">
                                Thanks! We’ve received your message and will be in
                                touch shortly.
                            </p>
                        </div>
                    )}

                    <Field label="Subject">
                        <TextField
                            required
                            variant="soft"
                            placeholder="What do you need help with?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </Field>

                    <Field label="Message">
                        <Textarea
                            required
                            rows={5}
                            placeholder="Tell us a bit more…"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Field>

                    <div className="flex justify-end">
                        <PillButton type="submit" loading={loading}>
                            Send message
                        </PillButton>
                    </div>
                </form>
            </PortalCard>
        </>
    )
}
