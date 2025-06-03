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
        default:
            return <></>
    }
}

const FileType = ({ type }: { type: string }) => {
    return <>{getFileType(type)}</>
}

export default FileType
