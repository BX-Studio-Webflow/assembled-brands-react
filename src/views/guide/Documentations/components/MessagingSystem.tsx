import { Card } from '@/components/ui'
import {
    HiOutlineChat,
    HiOutlineUser,
    HiOutlinePaperAirplane,
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineArchive,
    HiOutlineTrash,
    HiOutlineStar,
    HiOutlineLockClosed,
} from 'react-icons/hi'

const MessagingSystem = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Messaging System</h3>
                <p className="mb-4">
                    The Messaging System provides internal communication
                    capabilities for team members and customer support. Send and
                    receive messages, manage conversations, and maintain
                    organized communication channels within the platform.
                </p>
            </div>

            <div>
                <h4 className="mb-4">System Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineChat className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Real-time Messaging
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Instant messaging with real-time updates, typing
                            indicators, and message status tracking for seamless
                            communication.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineUser className="text-xl text-green-500" />
                            <h5 className="font-semibold">User Management</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Connect with team members, manage contact lists, and
                            organize conversations by users and groups.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Accessing the Messaging System</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineChat className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Navigation</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the messaging system at{' '}
                            <strong>Concepts → Chat</strong>. The interface
                            includes a sidebar with contacts and the main chat
                            area.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineUser className="text-xl text-green-500" />
                            <h5 className="font-semibold">Interface Layout</h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm text-gray-600">
                                The messaging interface consists of:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Contact Sidebar:</strong> List of
                                    available contacts and recent conversations
                                </li>
                                <li>
                                    • <strong>Chat Area:</strong> Main messaging
                                    window with message history
                                </li>
                                <li>
                                    • <strong>Message Input:</strong> Text area
                                    for composing and sending messages
                                </li>
                                <li>
                                    • <strong>Contact Info:</strong> Details
                                    about the selected contact
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Starting Conversations</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUser className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Selecting Contacts
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Choose who to message:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Browse Contacts:</strong> Scroll
                                    through the contact list in the sidebar
                                </li>
                                <li>
                                    • <strong>Search Contacts:</strong> Use the
                                    search function to find specific users
                                </li>
                                <li>
                                    • <strong>Recent Conversations:</strong>{' '}
                                    Click on recent chats to continue
                                    conversations
                                </li>
                                <li>
                                    • <strong>Online Status:</strong> See which
                                    contacts are currently online
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlinePaperAirplane className="text-xl text-green-500" />
                            <h5 className="font-semibold">Sending Messages</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Compose and send messages:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Type Message:</strong> Enter your
                                    message in the text input area
                                </li>
                                <li>
                                    • <strong>Send Message:</strong> Click the
                                    send button or press Enter to send
                                </li>
                                <li>
                                    • <strong>Message Status:</strong> See when
                                    messages are sent, delivered, and read
                                </li>
                                <li>
                                    • <strong>Typing Indicators:</strong> Know
                                    when the other person is typing
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Managing Conversations</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineSearch className="text-xl text-purple-500" />
                            <h5 className="font-semibold">
                                Searching Messages
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Find specific messages and conversations:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Message Search:</strong> Search
                                    for specific words or phrases in messages
                                </li>
                                <li>
                                    • <strong>Contact Search:</strong> Find
                                    contacts by name or username
                                </li>
                                <li>
                                    • <strong>Date Filtering:</strong> Filter
                                    messages by date range
                                </li>
                                <li>
                                    • <strong>Advanced Search:</strong> Use
                                    filters for more specific searches
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineStar className="text-xl text-yellow-500" />
                            <h5 className="font-semibold">
                                Organizing Conversations
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Keep your conversations organized:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Pin Conversations:</strong> Pin
                                    important conversations to the top
                                </li>
                                <li>
                                    • <strong>Mark as Read/Unread:</strong>{' '}
                                    Manage message status
                                </li>
                                <li>
                                    • <strong>Archive Conversations:</strong>{' '}
                                    Hide conversations without deleting them
                                </li>
                                <li>
                                    • <strong>Delete Messages:</strong> Remove
                                    individual messages or entire conversations
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Message Features</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineBell className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Notifications</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Stay informed about new messages:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Desktop Notifications:</strong>{' '}
                                    Receive notifications for new messages
                                </li>
                                <li>
                                    • <strong>Sound Alerts:</strong> Audio
                                    notifications for incoming messages
                                </li>
                                <li>
                                    • <strong>Unread Count:</strong> See the
                                    number of unread messages
                                </li>
                                <li>
                                    • <strong>Notification Settings:</strong>{' '}
                                    Customize notification preferences
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlinePaperAirplane className="text-xl text-green-500" />
                            <h5 className="font-semibold">Message Types</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Different types of messages you can send:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Text Messages:</strong> Standard
                                    text-based communication
                                </li>
                                <li>
                                    • <strong>File Attachments:</strong> Share
                                    documents, images, and other files
                                </li>
                                <li>
                                    • <strong>Emojis and Reactions:</strong>{' '}
                                    Express emotions and reactions
                                </li>
                                <li>
                                    • <strong>Quick Replies:</strong> Use
                                    pre-written responses for common messages
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Contact Management</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUser className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">
                                Contact Information
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                View and manage contact details:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Profile Information:</strong> View
                                    contact&apos;s profile and details
                                </li>
                                <li>
                                    • <strong>Online Status:</strong> See when
                                    contacts are available
                                </li>
                                <li>
                                    • <strong>Last Seen:</strong> Check when
                                    contacts were last active
                                </li>
                                <li>
                                    • <strong>Contact Actions:</strong> Block,
                                    report, or manage contact settings
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineArchive className="text-xl text-orange-500" />
                            <h5 className="font-semibold">
                                Conversation History
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Access and manage conversation history:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Message History:</strong> View all
                                    previous messages with a contact
                                </li>
                                <li>
                                    • <strong>File History:</strong> Access
                                    previously shared files
                                </li>
                                <li>
                                    • <strong>Search History:</strong> Find
                                    specific messages in conversation history
                                </li>
                                <li>
                                    • <strong>Export Conversations:</strong>{' '}
                                    Download conversation history if needed
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Privacy & Security</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineLockClosed className="text-xl text-red-500" />
                            <h5 className="font-semibold">Message Privacy</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Your messages are protected with security
                                features:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Encrypted Messages:</strong>{' '}
                                    Messages are encrypted for security
                                </li>
                                <li>
                                    • <strong>Private Conversations:</strong>{' '}
                                    Messages are only visible to participants
                                </li>
                                <li>
                                    • <strong>Message Deletion:</strong> Delete
                                    messages to remove them permanently
                                </li>
                                <li>
                                    • <strong>Block Users:</strong> Block
                                    unwanted contacts from messaging you
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-gray-500" />
                            <h5 className="font-semibold">Data Management</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Control your messaging data:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Message Retention:</strong>{' '}
                                    Messages are stored according to platform
                                    policies
                                </li>
                                <li>
                                    • <strong>Account Deletion:</strong> Remove
                                    your account and associated messages
                                </li>
                                <li>
                                    • <strong>Data Export:</strong> Download
                                    your message history if needed
                                </li>
                                <li>
                                    • <strong>Privacy Settings:</strong> Control
                                    who can message you
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Best Practices</h4>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <ul className="text-sm space-y-2">
                        <li>
                            • <strong>Professional Communication:</strong>{' '}
                            Maintain professional tone in business conversations
                        </li>
                        <li>
                            • <strong>Timely Responses:</strong> Respond to
                            messages promptly when possible
                        </li>
                        <li>
                            • <strong>Clear Messaging:</strong> Write clear,
                            concise messages to avoid confusion
                        </li>
                        <li>
                            • <strong>File Sharing:</strong> Use appropriate
                            file types and sizes when sharing documents
                        </li>
                        <li>
                            • <strong>Conversation Organization:</strong> Keep
                            important conversations pinned or archived
                        </li>
                        <li>
                            • <strong>Privacy Awareness:</strong> Be mindful of
                            sensitive information in messages
                        </li>
                        <li>
                            • <strong>Notification Management:</strong>{' '}
                            Configure notifications to avoid distractions
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MessagingSystem
