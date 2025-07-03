import { Card } from '@/components/ui'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineFilter,
    HiOutlineTag,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineCheckCircle,
} from 'react-icons/hi'

const LeadManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Lead Management</h3>
                <p className="mb-4">
                    The Lead Management system allows you to create, track, and
                    manage potential customers throughout their journey. This
                    comprehensive system includes status tracking, event
                    registration, callback scheduling, and advanced filtering
                    capabilities.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Creating a New Lead</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlus className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Step 1: Access Lead Creation
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Navigate to{' '}
                            <strong>Concepts → Leads → Lead Create</strong> or
                            click the &quot;Create Lead&quot; button from the lead list.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Step 2: Fill Required Information
                            </h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm">
                                <strong>Required Fields:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>First Name:</strong> Lead&apos;s first
                                    name
                                </li>
                                <li>
                                    • <strong>Last Name:</strong> Lead&apos;s last
                                    name
                                </li>
                                <li>
                                    • <strong>Email:</strong> Valid email
                                    address
                                </li>
                                <li>
                                    • <strong>Country Code:</strong> Phone
                                    country code
                                </li>
                                <li>
                                    • <strong>Phone Number:</strong> Mobile
                                    number
                                </li>
                            </ul>
                            <p className="text-sm">
                                <strong>Optional Fields:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Profile Image:</strong> Upload
                                    lead&apos;s photo
                                </li>
                                <li>
                                    • <strong>Event Registration:</strong>{' '}
                                    Register for specific events
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Lead Status System</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlinePlus className="text-green-500" />
                            <h5 className="font-semibold">New Lead</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Default status for newly created leads with no event
                            registrations or callbacks scheduled.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCalendar className="text-blue-500" />
                            <h5 className="font-semibold">
                                Registered for Event
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Lead has registered for one or more events but no
                            callback is scheduled.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlinePhone className="text-orange-500" />
                            <h5 className="font-semibold">Call Back</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Lead has a scheduled callback, regardless of event
                            registration status.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCheckCircle className="text-emerald-500" />
                            <h5 className="font-semibold">Attended Event</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Lead has attended at least one event, indicating
                            high engagement.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Managing Leads</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineEye className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Viewing Leads</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the lead list at{' '}
                            <strong>Concepts → Leads → Lead List</strong>. The
                            table displays all leads with their current status,
                            contact information, and action buttons.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">Editing Leads</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the edit icon (pencil) next to any lead to
                            modify their information. You can update contact
                            details, add event registrations, or schedule
                            callbacks.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">Deleting Leads</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the delete icon (trash) to remove a lead. A
                            confirmation dialog will appear to prevent
                            accidental deletions.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Advanced Features</h4>
                <div className="space-y-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineFilter className="text-xl text-purple-500" />
                            <h5 className="font-semibold">
                                Search & Filtering
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Use the search bar to find leads by name, email,
                                or phone number. Advanced filtering options
                                include:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • Status-based filtering (New, Registered,
                                    Callback, Attended)
                                </li>
                                <li>• Date range filtering</li>
                                <li>• Event-based filtering</li>
                                <li>• Tag-based filtering</li>
                            </ul>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineTag className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">Tag Management</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Organize leads with custom tags for better
                                categorization and follow-up:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • Create custom tags for different lead
                                    categories
                                </li>
                                <li>• Assign multiple tags to a single lead</li>
                                <li>• Filter leads by tags</li>
                                <li>• Remove tags when no longer needed</li>
                            </ul>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCalendar className="text-xl text-orange-500" />
                            <h5 className="font-semibold">Event Integration</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Seamlessly integrate leads with your event
                                management system:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • Register leads for events during creation
                                    or editing
                                </li>
                                <li>• Track event attendance automatically</li>
                                <li>• View lead&apos;s event history</li>
                                <li>• Send event-specific communications</li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Bulk Operations</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Perform actions on multiple leads simultaneously:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Select Multiple:</strong> Use
                                checkboxes to select multiple leads
                            </li>
                            <li>
                                • <strong>Bulk Delete:</strong> Remove multiple
                                leads at once
                            </li>
                            <li>
                                • <strong>Bulk Tag:</strong> Apply tags to
                                multiple leads
                            </li>
                            <li>
                                • <strong>Export Data:</strong> Export selected
                                leads to CSV
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">External Form Integration</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            The system supports external form submissions for
                            lead capture:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Event Link Validation:</strong>{' '}
                                Validate event registration links
                            </li>
                            <li>
                                • <strong>Ticket Payment Validation:</strong>{' '}
                                Verify ticket purchases
                            </li>
                            <li>
                                • <strong>Membership Purchase:</strong> Handle
                                membership upgrades
                            </li>
                            <li>
                                • <strong>External Form Processing:</strong>{' '}
                                Process leads from external sources
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
                            • <strong>Regular Follow-up:</strong> Schedule
                            callbacks for leads within 24-48 hours
                        </li>
                        <li>
                            • <strong>Status Updates:</strong> Keep lead status
                            current as they progress through your funnel
                        </li>
                        <li>
                            • <strong>Tagging Strategy:</strong> Use consistent
                            tagging to categorize leads effectively
                        </li>
                        <li>
                            • <strong>Data Quality:</strong> Ensure all required
                            fields are completed for better tracking
                        </li>
                        <li>
                            • <strong>Event Integration:</strong> Register leads
                            for relevant events to increase engagement
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default LeadManagement
