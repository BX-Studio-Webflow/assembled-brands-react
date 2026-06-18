/**
 * Dummy data standing in for a backend. Swap these out for real API calls
 * once the backend exists.
 */

export type DummyUser = {
    email: string
    password: string
    name: string
}

/** Pre-seeded accounts. `test@test.com` is used to demo the
 *  "account already exists" state on the sign-up screen. */
export const seededUsers: DummyUser[] = [
    { email: 'test@test.com', password: 'password', name: 'Buffy Team' },
    {
        email: 'demo@assembledbrands.com',
        password: 'demo1234',
        name: 'Demo User',
    },
    { email: 'brian@bx.studio', password: 'Brian!2001', name: 'Brian' },
]

export type Testimonial = {
    quote: string
    brand: string
    industry: string
    /** imported logo asset */
    logo: string
}

export type PartnerLogo = {
    name: string
}

export const partnerLogos: PartnerLogo[] = [
    { name: 'William Murray' },
    { name: 'ettitude' },
    { name: 'no cow' },
    { name: 'JUNESHINE' },
    { name: 'Better Booch' },
    { name: 'Buffy' },
]
