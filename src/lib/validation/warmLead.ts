export const WARM_LEAD_MIME = {
    pdf: 'application/pdf',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
} as const

export const WARM_LEAD_EXCEL_MIME_TYPES = [
    WARM_LEAD_MIME.xls,
    WARM_LEAD_MIME.xlsx,
] as const

export const WARM_LEAD_EXCEL_ACCEPT = '.xls,.xlsx'

export const WARM_LEAD_EXCEL_FORMAT_LABEL = 'Allowed file formats: EXCEL'

export const WARM_LEAD_EXCEL_INVALID_MESSAGE =
    'Invalid file type. Allowed file formats: EXCEL'

export const WARM_LEAD_TEAM_LEADERSHIP_MIME_TYPES = [
    WARM_LEAD_MIME.pdf,
    WARM_LEAD_MIME.ppt,
    WARM_LEAD_MIME.pptx,
    WARM_LEAD_MIME.doc,
    WARM_LEAD_MIME.docx,
    WARM_LEAD_MIME.xls,
    WARM_LEAD_MIME.xlsx,
] as const

export const WARM_LEAD_TEAM_LEADERSHIP_ACCEPT =
    '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx'

export const WARM_LEAD_TEAM_LEADERSHIP_FORMAT_LABEL =
    'Allowed file formats: PDF, PPT, WORD, EXCEL'

export const WARM_LEAD_TEAM_LEADERSHIP_INVALID_MESSAGE =
    'Invalid file type. Allowed file formats: PDF, PPT, WORD, EXCEL'

export const WARM_LEAD_CAP_TABLE_FORMAT_LABEL = 'Allowed file formats: EXCEL'

export const WARM_LEAD_CAP_TABLE_INVALID_MESSAGE =
    'Invalid file type. Allowed file formats: EXCEL'

export const WARM_LEAD_INSTORE_VELOCITY_MIME_TYPES = [
    WARM_LEAD_MIME.xlsx,
    WARM_LEAD_MIME.xls,
    WARM_LEAD_MIME.pdf,
] as const

export const WARM_LEAD_INSTORE_VELOCITY_ACCEPT = '.xlsx,.xls,.pdf'

export const WARM_LEAD_INSTORE_VELOCITY_FORMAT_LABEL =
    'Allowed file formats: PDF, EXCEL'

export const WARM_LEAD_INSTORE_VELOCITY_INVALID_MESSAGE =
    'Invalid file type. Allowed file formats: PDF, EXCEL'

export const WARM_LEAD_BUSINESS_PLAN_MIME_TYPES = [
    WARM_LEAD_MIME.pdf,
    WARM_LEAD_MIME.pptx,
] as const

export const WARM_LEAD_BUSINESS_PLAN_ACCEPT = '.pdf,.pptx'

export const WARM_LEAD_BUSINESS_PLAN_FORMAT_LABEL = 'Allowed file formats: PDF, PPT'

export const WARM_LEAD_BUSINESS_PLAN_INVALID_MESSAGE =
    'Invalid file type. Allowed file formats: PDF, PPT'

export const WARM_LEAD_INTERNATIONAL_LOCATION_PLACEHOLDER =
    'London, UK or Shanghai, China'

export function isValidWarmLeadMime(
    file: File,
    allowed: readonly string[],
): boolean {
    return allowed.includes(file.type)
}
