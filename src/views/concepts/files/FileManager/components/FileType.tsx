const getFileType = (type: string) => {
    switch (type) {
        case 'pdf':
            return 'PDF'
        case 'xls':
            return 'XLS'
        case 'doc':
            return 'DOC'
        case 'ppt':
            return 'PPT'
        case 'figma':
            return 'Figma'
        case 'image/jpeg':
            return 'JPEG'
        case 'image/png':
            return 'JPEG'
        case 'image/gif':
            return 'JPG'
        case 'image/webp':
            return 'JPG'
        case 'image/svg+xml':
            return 'SVG'
        case 'image/tiff':
            return 'TIFF'
        case 'image/bmp':
            return 'BMP'
        case 'image/ico':
            return 'ICO'
        case 'directory':
            return 'Folder'
        case 'video/mp4':
            return 'MP4'
        case 'video/webm':
            return 'WEBM'
        case 'video/ogg':
            return 'OGG'
        case 'video/quicktime':
            return 'MOV'

        // Audio files
        case 'audio/mp3':
            return 'MP3'
        case 'audio/m4a':
        case 'audio/x-m4a':
            return 'M4A'
        case 'audio/wav':
            return 'WAV'
        case 'audio/ogg':
            return 'OGG'
        case 'audio/aac':
            return 'AAC'
        case 'audio/flac':
            return 'FLAC'

        // Document files
        case 'application/pdf':
            return 'PDF'
        case 'application/zip':
        case 'application/x-zip-compressed':
            return 'ZIP'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'DOCX'
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'XLSX'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'PPTX'
        case 'application/msword':
            return 'DOC'
        case 'application/vnd.ms-excel':
            return 'XLS'
        case 'application/vnd.ms-powerpoint':
            return 'PPT'
        case 'application/rtf':
            return 'RTF'
        case 'text/plain':
            return 'TXT'
        case 'text/html':
            return 'HTML'
        case 'text/css':
            return 'CSS'
        case 'text/javascript':
            return 'JS'
        case 'application/json':
            return 'JSON'
        case 'application/xml':
            return 'XML'

        default: {
            // Fallback: extract file extension from content type or return uppercase content type
            const extension = type.split('/').pop()?.toUpperCase()
            return extension || type.toUpperCase()
        }
    }
}

const FileType = ({ type }: { type: string }) => {
    return <>{getFileType(type)}</>
}

export default FileType
