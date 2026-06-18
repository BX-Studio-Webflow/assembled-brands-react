/** Static option sets used across the application forms (dummy data). */

export const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
].map((s) => ({ label: s, value: s }))

export const ACCOUNTING_SOFTWARE = [
    { label: 'QuickBooks', value: 'quickbooks' },
    { label: 'QuickBooks Online', value: 'quickbooks_online' },
    { label: 'Netsuite', value: 'netsuite' },
    { label: 'Accumatica', value: 'accumatica' },
    { label: 'Other', value: 'other' },
]

export const LOAN_AMOUNT_OPTIONS = [
    { label: '$1M – $5M', value: '1-5' },
    { label: '$5M – $10M', value: '5-10' },
    { label: '$10M – $25M', value: '10-25' },
    { label: '$25M+', value: '25+' },
]

export const COMPANY_TYPES = [
    'CPG Company',
    'SaaS Company',
    'Consulting Firm',
    'Other',
    'Distributor or Wholesaler',
]

export const EMPLOYEE_RANGES = [
    'Just me',
    '2-10',
    '11-50',
    '51-100',
    '101-500',
    '501+',
]

export const ASSET_TYPES = [
    'Inventory',
    'Accounts Receivable',
    'Purchase Orders',
    'Not Sure',
]

export const LOAN_URGENCY = ['Yesterday', 'This Month', '3 Months', '2025']

export const YES_NO = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
]

export const INVITE_ROLES = [
    'CEO', 'CFO', 'CTO', 'COO', 'Founder', 'Finance', 'Operations', 'Other',
].map((s) => ({ label: s, value: s }))
