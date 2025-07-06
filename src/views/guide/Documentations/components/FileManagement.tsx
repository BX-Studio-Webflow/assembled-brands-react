import { Card } from '@/components/ui'
import {
    HiOutlineUpload,
    HiOutlineDownload,
    HiOutlineTrash,
    HiOutlineShare,
    HiOutlineFolder,
    HiOutlineDocument,
    HiOutlineVideoCamera,
    HiOutlinePhone,
    HiMusicNote,
} from 'react-icons/hi'

const FileManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">File Management</h3>
                <p className="mb-4">
                    The File Management system allows you to upload, organize,
                    and share files with team members and customers. Manage
                    various file types, control access permissions, and maintain
                    an organized digital asset library.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Supported File Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocument className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Documents</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            PDF, DOC, DOCX, TXT, RTF, and other document formats
                            for sharing reports, contracts, and written content.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlinePhone className="text-xl text-green-500" />
                            <h5 className="font-semibold">Images</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            JPG, PNG, GIF, SVG, and other image formats for
                            photos, graphics, and visual content.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineVideoCamera className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Videos</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            MP4, AVI, MOV, WMV, and other video formats for
                            presentations, tutorials, and media content.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiMusicNote className="text-xl text-orange-500" />
                            <h5 className="font-semibold">Audio</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            MP3, WAV, M4A, AAC, and other audio formats for
                            podcasts, music, and sound files.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">File Upload Guidelines</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUpload className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Upload Process</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Upload files through the File Manager interface:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Drag & Drop:</strong> Simply drag
                                    files from your computer to the upload area
                                </li>
                                <li>
                                    • <strong>Browse Files:</strong> Click the
                                    upload button to browse and select files
                                </li>
                                <li>
                                    • <strong>Multiple Files:</strong> Upload
                                    several files at once for efficiency
                                </li>
                                <li>
                                    • <strong>Progress Tracking:</strong>{' '}
                                    Monitor upload progress in real-time
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineFolder className="text-xl text-green-500" />
                            <h5 className="font-semibold">File Size Limits</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Understand file size restrictions:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Documents:</strong> Up to 50MB per
                                    file
                                </li>
                                <li>
                                    • <strong>Images:</strong> Up to 20MB per
                                    file
                                </li>
                                <li>
                                    • <strong>Videos:</strong> Up to 500MB per
                                    file
                                </li>
                                <li>
                                    • <strong>Audio:</strong> Up to 100MB per
                                    file
                                </li>
                                <li>
                                    • <strong>Total Storage:</strong> Varies by
                                    membership level
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">File Organization</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineFolder className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">File Naming</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Use descriptive file names for better
                                organization:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Descriptive Names:</strong> Use
                                    clear, meaningful file names
                                </li>
                                <li>
                                    • <strong>Date Formatting:</strong> Include
                                    dates in YYYY-MM-DD format when relevant
                                </li>
                                <li>
                                    • <strong>Version Control:</strong> Add
                                    version numbers for updated files
                                </li>
                                <li>
                                    • <strong>Consistent Formatting:</strong>{' '}
                                    Use consistent naming conventions
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineDocument className="text-xl text-purple-500" />
                            <h5 className="font-semibold">File Categories</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Organize files by type and purpose:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>By Type:</strong> Group documents,
                                    images, videos, and audio files
                                </li>
                                <li>
                                    • <strong>By Project:</strong> Organize
                                    files by specific projects or campaigns
                                </li>
                                <li>
                                    • <strong>By Date:</strong> Sort files by
                                    creation or modification date
                                </li>
                                <li>
                                    • <strong>By Access Level:</strong> Separate
                                    public and private files
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">File Management Operations</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineDownload className="text-xl text-green-500" />
                            <h5 className="font-semibold">Downloading Files</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Download files for offline access or sharing. Click
                            the download icon next to any file to save it to
                            your computer. Large files may take time to download
                            depending on your internet connection.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineShare className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Sharing Files</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Share files with team members and external
                                users:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Internal Sharing:</strong> Share
                                    with team members within the platform
                                </li>
                                <li>
                                    • <strong>External Links:</strong> Generate
                                    shareable links for external users
                                </li>
                                <li>
                                    • <strong>Access Permissions:</strong>{' '}
                                    Control who can view, download, or edit
                                    files
                                </li>
                                <li>
                                    • <strong>Link Expiration:</strong> Set time
                                    limits on shared links
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">Deleting Files</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Remove files that are no longer needed. Deleted
                            files are moved to a trash folder and can be
                            restored within 30 days. After 30 days, files are
                            permanently deleted.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">File Preview & Access</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineDocument className="text-xl text-blue-500" />
                            <h5 className="font-semibold">File Preview</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Preview files without downloading:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Document Preview:</strong> View
                                    PDFs and text files in the browser
                                </li>
                                <li>
                                    • <strong>Image Preview:</strong> See
                                    thumbnails and full-size images
                                </li>
                                <li>
                                    • <strong>Video Preview:</strong> Play
                                    videos directly in the browser
                                </li>
                                <li>
                                    • <strong>Audio Preview:</strong> Listen to
                                    audio files with built-in player
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineShare className="text-xl text-green-500" />
                            <h5 className="font-semibold">Access Control</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Manage who can access your files:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Public Files:</strong> Accessible
                                    to anyone with the link
                                </li>
                                <li>
                                    • <strong>Private Files:</strong> Only
                                    accessible to you and specified users
                                </li>
                                <li>
                                    • <strong>Team Files:</strong> Shared with
                                    your team members
                                </li>
                                <li>
                                    • <strong>Permission Levels:</strong> View,
                                    download, edit, or admin access
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">File Security & Backup</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineFolder className="text-xl text-red-500" />
                            <h5 className="font-semibold">Security Features</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Your files are protected with enterprise-grade
                                security:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Encryption:</strong> Files are
                                    encrypted both in transit and at rest
                                </li>
                                <li>
                                    • <strong>Access Logs:</strong> Track who
                                    accesses your files and when
                                </li>
                                <li>
                                    • <strong>Virus Scanning:</strong> Automatic
                                    malware detection on uploaded files
                                </li>
                                <li>
                                    • <strong>Secure Storage:</strong> Files
                                    stored in secure, redundant data centers
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineDownload className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Backup & Recovery</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Automatic backup and recovery features:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Automatic Backups:</strong> Files
                                    are backed up multiple times daily
                                </li>
                                <li>
                                    • <strong>Version History:</strong> Keep
                                    previous versions of updated files
                                </li>
                                <li>
                                    • <strong>Recovery Options:</strong> Restore
                                    files from backup if needed
                                </li>
                                <li>
                                    • <strong>Data Redundancy:</strong> Files
                                    stored across multiple locations
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">File Analytics</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Track file usage and performance:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Storage Usage:</strong> Monitor your
                                total storage consumption
                            </li>
                            <li>
                                • <strong>Download Statistics:</strong> Track
                                how often files are downloaded
                            </li>
                            <li>
                                • <strong>Access Analytics:</strong> See who is
                                accessing your files
                            </li>
                            <li>
                                • <strong>Popular Files:</strong> Identify your
                                most accessed content
                            </li>
                            <li>
                                • <strong>Storage Trends:</strong> Monitor
                                storage growth over time
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Best Practices</h4>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <ul className="text-sm space-y-2">
                        <li>
                            • <strong>Regular Cleanup:</strong> Delete unused
                            files to free up storage space
                        </li>
                        <li>
                            • <strong>Consistent Naming:</strong> Use clear,
                            descriptive file names for easy searching
                        </li>
                        <li>
                            • <strong>File Organization:</strong> Group related
                            files together for better management
                        </li>
                        <li>
                            • <strong>Access Control:</strong> Review and update
                            file permissions regularly
                        </li>
                        <li>
                            • <strong>Backup Strategy:</strong> Keep important
                            files backed up in multiple locations
                        </li>
                        <li>
                            • <strong>File Size Optimization:</strong> Compress
                            large files when possible
                        </li>
                        <li>
                            • <strong>Security Awareness:</strong> Be careful
                            when sharing sensitive files
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default FileManagement
