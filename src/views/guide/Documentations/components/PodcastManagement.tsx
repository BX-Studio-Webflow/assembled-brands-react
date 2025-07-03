import { Card } from '@/components/ui'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineMicrophone,
    HiOutlineUsers,
    HiOutlineUpload,
    HiOutlinePlay,
    HiOutlinePause,
    HiOutlineVolumeUp,
} from 'react-icons/hi'

const PodcastManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Podcast Management</h3>
                <p className="mb-4">
                    The Podcast Management system allows you to create, upload,
                    and organize podcast episodes with membership-based access
                    control. Manage episode types, track listener engagement,
                    and deliver content to your audience effectively.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Episode Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlinePlay className="text-xl text-green-500" />
                            <h5 className="font-semibold">Single Episode</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Individual podcast episodes that can be accessed
                            independently. Each episode is a standalone piece of
                            content.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineVolumeUp className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Multiple Episodes</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Series of related episodes that are grouped
                            together. Listeners can access the entire series as
                            a collection.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Creating a Podcast</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlus className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Step 1: Access Podcast Creation
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Navigate to{' '}
                            <strong>
                                Concepts → Podcasts → Podcast Create
                            </strong>{' '}
                            or click the "Create Podcast" button from the
                            podcast list.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Step 2: Fill Podcast Details
                            </h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm">
                                <strong>Basic Information:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Podcast Name:</strong> Title of
                                    your podcast or episode
                                </li>
                                <li>
                                    • <strong>Episode Type:</strong> Choose
                                    Single or Multiple episodes
                                </li>
                                <li>
                                    • <strong>Description:</strong> Detailed
                                    description of the content
                                </li>
                                <li>
                                    • <strong>Status:</strong> Active, Draft, or
                                    Archived
                                </li>
                            </ul>
                            <p className="text-sm">
                                <strong>Access Control:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Membership Access:</strong> Select
                                    which membership levels can access this
                                    podcast
                                </li>
                                <li>
                                    • <strong>Episode Order:</strong> For
                                    multiple episodes, set the sequence
                                </li>
                                <li>
                                    • <strong>Release Date:</strong> When the
                                    podcast becomes available
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Uploading Content</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUpload className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Audio File Upload</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Upload your podcast audio files with the
                                following specifications:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Supported Formats:</strong> MP3,
                                    WAV, M4A, AAC
                                </li>
                                <li>
                                    • <strong>File Size Limit:</strong> Up to
                                    500MB per episode
                                </li>
                                <li>
                                    • <strong>Audio Quality:</strong>{' '}
                                    Recommended 128kbps or higher
                                </li>
                                <li>
                                    • <strong>Duration:</strong> No specific
                                    limit, but consider user experience
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineMicrophone className="text-xl text-orange-500" />
                            <h5 className="font-semibold">
                                Content Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Organize your podcast content effectively:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Episode Titles:</strong> Use
                                    descriptive, engaging titles
                                </li>
                                <li>
                                    • <strong>Show Notes:</strong> Add detailed
                                    descriptions and timestamps
                                </li>
                                <li>
                                    • <strong>Tags:</strong> Categorize episodes
                                    for better discovery
                                </li>
                                <li>
                                    • <strong>Thumbnails:</strong> Upload custom
                                    episode artwork
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Managing Podcasts</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlay className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Viewing Podcasts</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the podcast list at{' '}
                            <strong>Concepts → Podcasts → Podcast List</strong>.
                            The table displays all podcasts with their type,
                            membership access, status, and creation date.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">Editing Podcasts</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the edit icon (pencil) to modify podcast
                            details. You can update information, change access
                            permissions, or replace audio files.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">Deleting Podcasts</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the delete icon (trash) to remove a podcast. A
                            confirmation dialog will appear to prevent
                            accidental deletions.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Membership Integration</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">Access Control</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Control who can access your podcast content:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Membership Levels:</strong> Assign
                                    podcasts to specific membership tiers
                                </li>
                                <li>
                                    • <strong>Exclusive Content:</strong> Create
                                    premium episodes for higher-tier members
                                </li>
                                <li>
                                    • <strong>Free Episodes:</strong> Offer
                                    sample content to attract new members
                                </li>
                                <li>
                                    • <strong>Access Tracking:</strong> Monitor
                                    which members are listening to which
                                    episodes
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineVolumeUp className="text-xl text-teal-500" />
                            <h5 className="font-semibold">Content Strategy</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Develop an effective content strategy:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Series Planning:</strong> Create
                                    multiple episodes around a theme
                                </li>
                                <li>
                                    • <strong>Release Schedule:</strong>{' '}
                                    Maintain consistent publishing frequency
                                </li>
                                <li>
                                    • <strong>Cross-Promotion:</strong>{' '}
                                    Reference other episodes and content
                                </li>
                                <li>
                                    • <strong>Member Feedback:</strong> Use
                                    listener input to guide content creation
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Analytics & Performance</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlay className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Listener Analytics
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Track podcast performance and listener
                                engagement:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Play Count:</strong> Track how
                                    many times each episode is played
                                </li>
                                <li>
                                    • <strong>Completion Rate:</strong> Monitor
                                    how many listeners finish episodes
                                </li>
                                <li>
                                    • <strong>Member Engagement:</strong> See
                                    which membership levels are most active
                                </li>
                                <li>
                                    • <strong>Popular Episodes:</strong>{' '}
                                    Identify your most successful content
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Audience Insights</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Understand your audience better:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Listening Patterns:</strong> When
                                    and how often members listen
                                </li>
                                <li>
                                    • <strong>Content Preferences:</strong>{' '}
                                    Which topics and formats perform best
                                </li>
                                <li>
                                    • <strong>Member Retention:</strong> How
                                    podcasts contribute to membership retention
                                </li>
                                <li>
                                    • <strong>Growth Metrics:</strong> Track
                                    audience growth over time
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Content Organization</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Organize your podcast content for better user
                            experience:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Episode Numbering:</strong> Use
                                consistent numbering for series
                            </li>
                            <li>
                                • <strong>Categories:</strong> Group episodes by
                                topic or theme
                            </li>
                            <li>
                                • <strong>Season Structure:</strong> Organize
                                content into seasons or series
                            </li>
                            <li>
                                • <strong>Featured Episodes:</strong> Highlight
                                your best content
                            </li>
                            <li>
                                • <strong>Related Content:</strong> Link
                                episodes to other relevant content
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
                            • <strong>Quality Audio:</strong> Invest in good
                            recording equipment and editing software
                        </li>
                        <li>
                            • <strong>Consistent Schedule:</strong> Publish
                            episodes regularly to maintain audience engagement
                        </li>
                        <li>
                            • <strong>Engaging Content:</strong> Create
                            compelling titles and descriptions
                        </li>
                        <li>
                            • <strong>Member Value:</strong> Ensure podcast
                            content provides value to your membership
                        </li>
                        <li>
                            • <strong>Cross-Promotion:</strong> Use podcasts to
                            promote other content and events
                        </li>
                        <li>
                            • <strong>Feedback Loop:</strong> Encourage and
                            respond to member feedback
                        </li>
                        <li>
                            • <strong>Technical Quality:</strong> Ensure good
                            audio quality and proper file formatting
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PodcastManagement
