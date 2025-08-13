import FileDoc from '@/assets/svg/files/FileDoc'
import FileXls from '@/assets/svg/files/FileXls'
import FilePdf from '@/assets/svg/files/FilePdf'
import FilePpt from '@/assets/svg/files/FilePpt'
import FileFigma from '@/assets/svg/files/FileFigma'
import FileImage from '@/assets/svg/files/FileImage'
import Folder from '@/assets/svg/files/Folder'
import FileVideo from '@/assets/svg/files/FileVideo'
import FileAudio from '@/assets/svg/files/FileAudio'

const FileIcon = ({ type, size = 40 }: { type: string; size?: number }) => {
    switch (type) {
        case 'pdf':
            return <FilePdf height={size} width={size} />
        case 'xls':
        case 'xlsx':
            return <FileXls height={size} width={size} />
        case 'doc':
        case 'docx':
            return <FileDoc height={size} width={size} />
        case 'ppt':
        case 'pptx':
            return <FilePpt height={size} width={size} />
        case 'figma':
            return <FileFigma height={size} width={size} />
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
        case 'bmp':
        case 'tiff':
        case 'ico':
            return <FileImage height={size} width={size} />
        case 'directory':
            return <Folder height={size} width={size} />
        case 'image':
            return <FileImage height={size} width={size} />
        case 'profile_picture':
            return <FileImage height={size} width={size} />
        case 'video':
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'flv':
        case 'webm':
        case 'mkv':
            return <FileVideo height={size} width={size} />
        case 'audio':
        case 'mp3':
        case 'wav':
        case 'aac':
        case 'ogg':
        case 'flac':
        case 'm4a':
            return <FileAudio height={size} width={size} />
        case 'document':
            return <FileDoc height={size} width={size} />
        case 'txt':
        case 'rtf':
        case 'odt':
        case 'pages':
            return <FileDoc height={size} width={size} />
        case 'csv':
        case 'ods':
        case 'numbers':
            return <FileXls height={size} width={size} />
        case 'odp':
        case 'key':
            return <FilePpt height={size} width={size} />
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return <Folder height={size} width={size} />
        case 'js':
        case 'ts':
        case 'py':
        case 'java':
        case 'cpp':
        case 'html':
        case 'css':
        case 'json':
        case 'xml':
        case 'sql':
            return <FileDoc height={size} width={size} />

        default:
            return <></>
    }
}

export default FileIcon
