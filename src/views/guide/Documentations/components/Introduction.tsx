import { Card } from '@/components/ui'
import {
    HiOutlineLightBulb,
    HiOutlineUserGroup,
    HiOutlineCalendar,
    HiOutlineMicrophone,
    HiOutlineAcademicCap,
    HiOutlineDocumentText,
    HiOutlineChat,
    HiOutlineFolder,
    HiOutlineCreditCard,
} from 'react-icons/hi'

const Introduction = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Welcome to Yeebli</h3>
                <p className="mb-4">
                    Yeebli is a comprehensive business management platform
                    designed to help you manage leads, events, content, and
                    customer relationships all in one place. This guide will
                    walk you through all the features and how to use them
                    effectively.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Key Features Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineLightBulb className="text-2xl text-blue-500" />
                            <h5 className="font-semibold">Lead Management</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Create, track, and manage leads with advanced
                            filtering, status tracking, and automated workflows.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCalendar className="text-2xl text-green-500" />
                            <h5 className="font-semibold">Event Management</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Schedule and manage events, invite participants,
                            track attendance, and handle different event types.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineMicrophone className="text-2xl text-purple-500" />
                            <h5 className="font-semibold">
                                Podcast Management
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Upload, organize, and manage podcast episodes with
                            membership-based access control.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineAcademicCap className="text-2xl text-orange-500" />
                            <h5 className="font-semibold">Course Management</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Create and manage educational courses with modules,
                            lessons, and content organization.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineUserGroup className="text-2xl text-indigo-500" />
                            <h5 className="font-semibold">Membership System</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Manage user memberships, access levels, and
                            subscription-based content delivery.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineChat className="text-2xl text-teal-500" />
                            <h5 className="font-semibold">Messaging System</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Internal messaging system for team communication and
                            customer support.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineFolder className="text-2xl text-gray-500" />
                            <h5 className="font-semibold">File Management</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Upload, organize, and share files with team members
                            and customers.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-2xl text-red-500" />
                            <h5 className="font-semibold">
                                Content Management
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Create and manage various types of content including
                            articles, documents, and media.
                        </p>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCreditCard className="text-2xl text-emerald-500" />
                            <h5 className="font-semibold">
                                Payment Integration
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Integrated payment processing for memberships,
                            events, and course purchases.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Getting Started</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm">
                        <strong>Quick Start:</strong> Begin by exploring the
                        Lead Management section to understand how to create and
                        manage your first leads. Then move on to Events to see
                        how to schedule and manage your first event.
                    </p>
                </div>
            </div>

            <div>
                <h4 className="mb-4">User Roles & Permissions</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium">Owner:</span>
                        <span className="text-sm text-gray-600">
                            Full access to all features and admin functions
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">Master:</span>
                        <span className="text-sm text-gray-600">
                            Can manage leads, events, and content with some
                            admin restrictions
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">User:</span>
                        <span className="text-sm text-gray-600">
                            Basic access to view and interact with content
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Navigation</h4>
                <p className="text-sm text-gray-600 mb-4">
                    Use the sidebar navigation to access different sections of
                    the application. Each section is organized by functionality
                    and includes detailed guides for specific features.
                </p>
            </div>
        </div>
    )
}

export default Introduction
