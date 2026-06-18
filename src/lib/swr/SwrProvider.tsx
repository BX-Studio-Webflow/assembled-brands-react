import { SWRConfig } from 'swr'
import type { ReactNode } from 'react'

const defaultOptions = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
}

export default function SwrProvider({ children }: { children: ReactNode }) {
    return <SWRConfig value={defaultOptions}>{children}</SWRConfig>
}
