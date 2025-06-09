import { useMailStore } from '../store/mailStore'
import cloneDeep from 'lodash/cloneDeep'
import type { Mail } from '../types'
import { apiToggleMail, apiDeleteMail } from '@/services/MailService'

const useMailAction = () => {
    const { mailList, setMail, setMailList, setSelectedMail } = useMailStore()

    const updateMailList = (newMail: Mail) => {
        const newMailList = cloneDeep(mailList).map((mail) => {
            if (mail.id === newMail.id) {
                mail = newMail
            }
            return mail
        })
        setMailList(newMailList)
    }

    const onStarToggle = async (mail: Mail, shouldSetMail: boolean = true) => {
        try {
            await apiToggleMail(mail.id, 'star')
            const newMail = cloneDeep(mail)
            newMail.starred = !newMail.starred
            if (shouldSetMail) {
                setMail(newMail)
            }
            updateMailList(newMail)
        } catch (error) {
            console.error('Error toggling star:', error)
        }
    }

    const onFlagToggle = async (mail: Mail, shouldSetMail: boolean = true) => {
        try {
            await apiToggleMail(mail.id, 'flag')
            const newMail = cloneDeep(mail)
            newMail.flagged = !newMail.flagged
            if (shouldSetMail) {
                setMail(newMail)
            }
            updateMailList(newMail)
        } catch (error) {
            console.error('Error toggling flag:', error)
        }
    }

    const onCheckboxToggle = (mail: Mail) => {
        const newMail = cloneDeep(mail)
        newMail.checked = !newMail.checked
        updateMailList(newMail)
    }

    const onMoveMailClick = (mail: Mail, destination: string) => {
        const newMail = cloneDeep(mail)
        newMail.status = destination
        updateMailList(newMail)
    }

    const onBatchMoveMailClick = (mailsId: number[], destination: string) => {
        setMailList(
            mailList.map((mail) => {
                if (mailsId.includes(mail.id)) {
                    mail.status = destination
                    mail.checked = false
                }
                return mail
            }),
        )
        setSelectedMail([])
    }

    const onMailDelete = async (mailsId: number[]) => {
        try {
            // Delete all emails in parallel
            await Promise.all(mailsId.map((id) => apiDeleteMail(id)))
            // Update local state after successful deletion
            setMailList(mailList.filter((mail) => !mailsId.includes(mail.id)))
            setSelectedMail([])
        } catch (error) {
            console.error('Error deleting emails:', error)
        }
    }

    const onResetChecked = () => {
        setMailList(
            mailList.map((mail) => {
                mail.checked = false
                return mail
            }),
        )
        setSelectedMail([])
    }

    return {
        onStarToggle,
        onMailDelete,
        onFlagToggle,
        onMoveMailClick,
        onCheckboxToggle,
        onResetChecked,
        onBatchMoveMailClick,
    }
}

export default useMailAction
