import { Card } from '@/components/ui'
import {
    HiOutlineUser,
    HiOutlineCog,
    HiOutlineHome,
    HiOutlineMenu,
    HiOutlineBell,
    HiOutlineSearch,
    HiOutlineQuestionMarkCircle,
} from 'react-icons/hi'

const UserGuide = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">User Guide - How to Use Yeebli</h3>
                <p className="mb-4">
                    This comprehensive guide will walk you through how to use
                    all the features of the Yeebli platform. Whether you&apos;re
                    a new user or an experienced member, this guide will help
                    you make the most of the application.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Getting Started</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineHome className="text-xl text-blue-500" />
                            <h5 className="font-semibold">First Steps</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Welcome to Yeebli! Here&apos;s how to get
                                started:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Account Setup:</strong> Complete
                                    your profile and preferences
                                </li>
                                <li>
                                    • <strong>Explore Dashboard:</strong>{' '}
                                    Familiarize yourself with the main interface
                                </li>
                                <li>
                                    • <strong>Browse Content:</strong> Check out
                                    available courses, podcasts, and events
                                </li>
                                <li>
                                    • <strong>Join Communities:</strong> Connect
                                    with other members
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Navigation & Interface</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineMenu className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Main Navigation</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Use the sidebar navigation to access different
                            sections of the application. The menu is organized
                            by functionality and includes all major features.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineSearch className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Search Functionality
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Use the search bar to quickly find content, users,
                            or specific information. Search works across all
                            sections of the application.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineBell className="text-xl text-orange-500" />
                            <h5 className="font-semibold">Notifications</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Stay updated with notifications about new content,
                            messages, events, and important updates. Configure
                            your notification preferences in settings.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineUser className="text-xl text-purple-500" />
                            <h5 className="font-semibold">User Profile</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access your profile to update information, view your
                            activity, manage preferences, and control your
                            account settings.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Core Features Walkthrough</h4>
                <Card className="mb-6">
                    <div className="space-y-6">
                        <div>
                            <h5 className="font-semibold mb-3 text-blue-600">
                                📊 Lead Management
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For Business Users:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Create and manage potential customer
                                        leads
                                    </li>
                                    <li>
                                        • Track lead status and progress through
                                        your funnel
                                    </li>
                                    <li>
                                        • Register leads for events and track
                                        attendance
                                    </li>
                                    <li>
                                        • Use tags and filters to organize your
                                        lead database
                                    </li>
                                    <li>• Schedule callbacks and follow-ups</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-green-600">
                                📅 Event Management
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For Event Organizers:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Create and schedule various types of
                                        events
                                    </li>
                                    <li>
                                        • Manage participant registrations and
                                        attendance
                                    </li>
                                    <li>
                                        • Host live events or upload
                                        pre-recorded content
                                    </li>
                                    <li>
                                        • Track event performance and engagement
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>For Participants:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Browse and register for available
                                        events
                                    </li>
                                    <li>
                                        • Access event content and materials
                                    </li>
                                    <li>
                                        • Participate in live events and
                                        discussions
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-purple-600">
                                🎙️ Podcast Management
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For Content Creators:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Upload and organize podcast episodes
                                    </li>
                                    <li>
                                        • Control access based on membership
                                        levels
                                    </li>
                                    <li>
                                        • Track listener engagement and
                                        analytics
                                    </li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>For Listeners:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Access podcast content based on your
                                        membership
                                    </li>
                                    <li>
                                        • Stream episodes directly in the
                                        platform
                                    </li>
                                    <li>
                                        • Download episodes for offline
                                        listening
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-orange-600">
                                📚 Course Management
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For Educators:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Create structured courses with modules
                                        and lessons
                                    </li>
                                    <li>
                                        • Upload various types of content (text,
                                        video, audio)
                                    </li>
                                    <li>
                                        • Track student progress and engagement
                                    </li>
                                    <li>• Issue completion certificates</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-2">
                                    <strong>For Students:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Enroll in courses based on your
                                        membership level
                                    </li>
                                    <li>
                                        • Progress through modules and lessons
                                        at your own pace
                                    </li>
                                    <li>
                                        • Access course materials and resources
                                    </li>
                                    <li>• Track your learning progress</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-indigo-600">
                                👥 Membership System
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For Members:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Choose from different membership tiers
                                    </li>
                                    <li>
                                        • Access content based on your
                                        membership level
                                    </li>
                                    <li>
                                        • Upgrade or downgrade your membership
                                    </li>
                                    <li>
                                        • Manage your subscription and billing
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-teal-600">
                                💬 Messaging System
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For All Users:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>
                                        • Send and receive messages with other
                                        members
                                    </li>
                                    <li>• Share files and resources</li>
                                    <li>
                                        • Organize conversations and contacts
                                    </li>
                                    <li>
                                        • Use real-time messaging with
                                        notifications
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3 text-gray-600">
                                📁 File Management
                            </h5>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>For All Users:</strong>
                                </p>
                                <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                    <li>• Upload and organize files</li>
                                    <li>• Share files with team members</li>
                                    <li>• Control access permissions</li>
                                    <li>• Preview and download files</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">User Roles & Permissions</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <HiOutlineUser className="text-2xl text-red-500" />
                                </div>
                                <h5 className="font-semibold text-red-600">
                                    Owner
                                </h5>
                                <p className="text-sm text-gray-600">
                                    Full access to all features, admin
                                    functions, and user management. Can create
                                    and manage all content types.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <HiOutlineUser className="text-2xl text-orange-500" />
                                </div>
                                <h5 className="font-semibold text-orange-600">
                                    Master
                                </h5>
                                <p className="text-sm text-gray-600">
                                    Can manage leads, events, content, and users
                                    with some admin restrictions. Full access to
                                    most features.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <HiOutlineUser className="text-2xl text-blue-500" />
                                </div>
                                <h5 className="font-semibold text-blue-600">
                                    User
                                </h5>
                                <p className="text-sm text-gray-600">
                                    Basic access to view and interact with
                                    content based on membership level. Limited
                                    administrative functions.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Tips & Best Practices</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineQuestionMarkCircle className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Getting the Most Out of Yeebli
                            </h5>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <h6 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    For New Users:
                                </h6>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>
                                        • Complete your profile with accurate
                                        information
                                    </li>
                                    <li>
                                        • Explore the dashboard to understand
                                        available features
                                    </li>
                                    <li>
                                        • Start with basic content before diving
                                        into advanced features
                                    </li>
                                    <li>
                                        • Join communities and connect with
                                        other members
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <h6 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                    For Content Creators:
                                </h6>
                                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                    <li>
                                        • Plan your content strategy before
                                        creating courses or podcasts
                                    </li>
                                    <li>
                                        • Use consistent naming conventions for
                                        better organization
                                    </li>
                                    <li>
                                        • Engage with your audience through the
                                        messaging system
                                    </li>
                                    <li>
                                        • Monitor analytics to understand what
                                        content performs best
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <h6 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                    For Business Users:
                                </h6>
                                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                                    <li>
                                        • Use the lead management system to
                                        track potential customers
                                    </li>
                                    <li>
                                        • Integrate events with your lead
                                        generation strategy
                                    </li>
                                    <li>
                                        • Leverage the membership system for
                                        recurring revenue
                                    </li>
                                    <li>
                                        • Use analytics to measure the
                                        effectiveness of your campaigns
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Getting Help</h4>
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineCog className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Support Resources</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                If you need help using the platform:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Documentation:</strong> Browse the
                                    detailed documentation sections
                                </li>
                                <li>
                                    • <strong>Messaging System:</strong> Contact
                                    support through the messaging feature
                                </li>
                                <li>
                                    • <strong>Community Forums:</strong> Ask
                                    questions in community discussions
                                </li>
                                <li>
                                    • <strong>Settings Help:</strong> Check the
                                    settings section for configuration options
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default UserGuide
