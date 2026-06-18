export const COLD_DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
] as const

export const COLD_DOCUMENT_FORMAT_LABEL =
    'PDF, Word, Excel, or CSV'

export const COLD_DOCUMENT_INVALID_MESSAGE =
    'Invalid file type. Please upload PDF, Word, Excel, or CSV files'
