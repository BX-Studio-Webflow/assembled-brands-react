import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UploadedFile = {
    name: string
    size: number
}

export type TeamMember = {
    id: string
    fullName: string
    email: string
    role: string
    message?: string
    status: 'Pending' | 'Active'
}

type QualifyData = {
    legalName: string
    employees: string
    website: string
    yearsInBusiness: string
    assetType: string
    loanAmount: string
    companyType: string
    otherCompanyType: string
    revenuesOver10mm: string
}

type ClaimData = {
    workEmail: string
    firstName: string
    lastName: string
    password: string
    loanUrgency: string
}

type CompanyProfileData = {
    legalName: string
    headquarters: string
    yearFormed: string
    accountingSoftware: string
    accountingOther: string
}

type FinancialOverviewData = {
    revenuesLast12: string
    netIncomeLast12: string
    projectedRevenue: string
    grossProfit: string
    grossMargin: string
    territory: string
    biggestExpense: string
}

type ApplicationState = {
    qualify: QualifyData
    claim: ClaimData
    companyProfile: CompanyProfileData
    financialOverview: FinancialOverviewData
    documents: Record<string, UploadedFile[]>
    members: TeamMember[]

    patchQualify: (p: Partial<QualifyData>) => void
    patchClaim: (p: Partial<ClaimData>) => void
    patchCompanyProfile: (p: Partial<CompanyProfileData>) => void
    patchFinancialOverview: (p: Partial<FinancialOverviewData>) => void

    addDocument: (slot: string, file: UploadedFile) => void
    removeDocument: (slot: string, name: string) => void

    addMember: (m: Omit<TeamMember, 'id' | 'status'>) => void
    removeMember: (id: string) => void

    reset: () => void
}

const emptyQualify: QualifyData = {
    legalName: '',
    employees: '',
    website: '',
    yearsInBusiness: '',
    assetType: '',
    loanAmount: '',
    companyType: '',
    otherCompanyType: '',
    revenuesOver10mm: '',
}

const emptyClaim: ClaimData = {
    workEmail: '',
    firstName: '',
    lastName: '',
    password: '',
    loanUrgency: '',
}

const emptyCompanyProfile: CompanyProfileData = {
    legalName: '',
    headquarters: '',
    yearFormed: '',
    accountingSoftware: '',
    accountingOther: '',
}

const emptyFinancialOverview: FinancialOverviewData = {
    revenuesLast12: '',
    netIncomeLast12: '',
    projectedRevenue: '',
    grossProfit: '',
    grossMargin: '',
    territory: '',
    biggestExpense: '',
}

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            qualify: emptyQualify,
            claim: emptyClaim,
            companyProfile: emptyCompanyProfile,
            financialOverview: emptyFinancialOverview,
            documents: {},
            members: [],

            patchQualify: (p) =>
                set((s) => ({ qualify: { ...s.qualify, ...p } })),
            patchClaim: (p) => set((s) => ({ claim: { ...s.claim, ...p } })),
            patchCompanyProfile: (p) =>
                set((s) => ({
                    companyProfile: { ...s.companyProfile, ...p },
                })),
            patchFinancialOverview: (p) =>
                set((s) => ({
                    financialOverview: { ...s.financialOverview, ...p },
                })),

            addDocument: (slot, file) =>
                set((s) => ({
                    documents: {
                        ...s.documents,
                        [slot]: [
                            ...(s.documents[slot] ?? []).filter(
                                (f) => f.name !== file.name,
                            ),
                            file,
                        ],
                    },
                })),
            removeDocument: (slot, name) =>
                set((s) => ({
                    documents: {
                        ...s.documents,
                        [slot]: (s.documents[slot] ?? []).filter(
                            (f) => f.name !== name,
                        ),
                    },
                })),

            addMember: (m) =>
                set((s) => ({
                    members: [
                        ...s.members,
                        {
                            ...m,
                            id: crypto.randomUUID(),
                            status: 'Pending',
                        },
                    ],
                })),
            removeMember: (id) =>
                set((s) => ({
                    members: s.members.filter((m) => m.id !== id),
                })),

            reset: () =>
                set({
                    qualify: emptyQualify,
                    claim: emptyClaim,
                    companyProfile: emptyCompanyProfile,
                    financialOverview: emptyFinancialOverview,
                    documents: {},
                    members: [],
                }),
        }),
        { name: 'ab.application' },
    ),
)
