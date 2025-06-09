import { useMailStore } from '../store/mailStore'
import { apiGetMails, apiGetMail } from '@/services/MailService'
import useSWRMutation from 'swr/mutation'
import type { GetMailsResponse, GetMailResponse } from '../types'

async function getMails(
    _: string,
    { arg }: { arg: { category: string; label: string } },
) {
    const data = await apiGetMails<GetMailsResponse>(arg)
    return data
}

async function getMail(_: string, { arg }: { arg: string }) {
    const data = await apiGetMail<GetMailResponse>(arg)
    return data
}

const useMail = () => {
    const {
        setMailList,
        setMail,
        selectedMailId,
        setMailListFetched,
        setSelectedMail,
    } = useMailStore()

    const { trigger: fetchMails, isMutating: isMailsFetching } = useSWRMutation(
        `/email`,
        getMails,
        {
            onSuccess: (list) => {
                setSelectedMail([])
                setMailList(list)
                setMailListFetched(true)
            },
        },
    )

    const { trigger: fetchMail, isMutating: isMailFetching } = useSWRMutation(
        `/email/${selectedMailId[0]}`,
        getMail,
        {
            onSuccess: (mail) => {
                setMail(mail)
            },
        },
    )

    return {
        fetchMails,
        isMailsFetching,
        fetchMail,
        isMailFetching,
    }
}

export default useMail
