/** Simulate network latency for the dummy data layer. */
export const sleep = (ms = 600) => new Promise((r) => setTimeout(r, ms))

/** Tailwind-friendly conditional class join. */
export function cx(...parts: Array<string | false | null | undefined>): string {
    return parts.filter(Boolean).join(' ')
}
