import { Card } from '@/components/ui'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineUsers,
    HiOutlineVideoCamera,
    HiOutlineFilm,
    HiOutlineLink,
    HiMap,
} from 'react-icons/hi'

const EventManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Event Management</h3>
                <p className="mb-4">
                    The Event Management system allows you to create, schedule,
                    and manage various types of events including live venues,
                    video calls, and pre-recorded content. Track attendance,
                    manage participants, and integrate with your lead management
                    system.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Event Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiMap className="text-xl text-green-500" />
                            <h5 className="font-semibold">Live Venue</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Physical events held at specific locations with
                            in-person attendance tracking.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineVideoCamera className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Live Video Call</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Virtual events conducted through video conferencing
                            platforms with real-time interaction.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineFilm className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Pre-recorded</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Pre-recorded content that participants can watch at
                            their convenience with streaming capabilities.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Creating an Event</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlus className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Step 1: Access Event Creation
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Navigate to{' '}
                            <strong>Concepts → Events → Event Create</strong> or
                            click the &quot;Create Event&quot; button from the
                            event list.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Step 2: Fill Event Details
                            </h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm">
                                <strong>Basic Information:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Event Name:</strong> Descriptive
                                    title for your event
                                </li>
                                <li>
                                    • <strong>Event Type:</strong> Choose from
                                    Live Venue, Live Video Call, or Pre-recorded
                                </li>
                                <li>
                                    • <strong>Description:</strong> Detailed
                                    description of the event
                                </li>
                                <li>
                                    • <strong>Date & Time:</strong> Event
                                    schedule and duration
                                </li>
                            </ul>
                            <p className="text-sm">
                                <strong>Advanced Settings:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Location/Venue:</strong> Physical
                                    address or virtual meeting link
                                </li>
                                <li>
                                    • <strong>Capacity:</strong> Maximum number
                                    of participants
                                </li>
                                <li>
                                    • <strong>Host ID:</strong> Event organizer
                                    information
                                </li>
                                <li>
                                    • <strong>Status:</strong> Active,
                                    Suspended, or Cancelled
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Event Status Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h5 className="font-semibold">Active</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Event is currently active and accepting
                            registrations. Participants can view and register
                            for the event.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <h5 className="font-semibold">Suspended</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Event is temporarily suspended. No new registrations
                            are accepted, but existing registrations remain
                            valid.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <h5 className="font-semibold">Cancelled</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Event has been cancelled. All registrations are void
                            and participants should be notified.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Managing Events</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineEye className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Viewing Events</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the event list at{' '}
                            <strong>Concepts → Events → Event List</strong>. The
                            table displays all events with their type, status,
                            host information, and action buttons.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">Editing Events</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the edit icon (pencil) to modify event
                            details. You can update information, change status,
                            or adjust participant limits.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineEye className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Event Streaming</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the view icon (eye) to access the event stream
                            page where you can manage live content and
                            participant interactions.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">Deleting Events</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the delete icon (trash) to remove an event. A
                            confirmation dialog will appear to prevent
                            accidental deletions.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Event Streaming & Management</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineVideoCamera className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Live Event Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                For live events, access the streaming interface
                                to:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>• Start and stop live streams</li>
                                <li>• Manage participant access</li>
                                <li>• Monitor attendance in real-time</li>
                                <li>• Handle technical issues</li>
                                <li>• Record sessions for later viewing</li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineFilm className="text-xl text-purple-500" />
                            <h5 className="font-semibold">
                                Pre-recorded Content
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                For pre-recorded events, manage content
                                delivery:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>• Upload video files</li>
                                <li>• Set access permissions</li>
                                <li>• Track viewing progress</li>
                                <li>• Manage content availability</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Participant Management</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Registration Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Manage event participants effectively:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>View Registrations:</strong> See
                                    all registered participants
                                </li>
                                <li>
                                    • <strong>Attendance Tracking:</strong> Mark
                                    participants as attended
                                </li>
                                <li>
                                    • <strong>Capacity Management:</strong>{' '}
                                    Monitor and adjust participant limits
                                </li>
                                <li>
                                    • <strong>Waitlist Management:</strong>{' '}
                                    Handle overflow registrations
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineLink className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Lead Integration</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Seamlessly integrate with your lead management
                                system:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • Register leads directly from the lead
                                    management system
                                </li>
                                <li>
                                    • Update lead status based on event
                                    attendance
                                </li>
                                <li>
                                    • Track lead engagement through event
                                    participation
                                </li>
                                <li>
                                    • Generate follow-up tasks based on event
                                    outcomes
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Event Analytics & Reporting</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Track event performance and participant engagement:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Registration Metrics:</strong> Track
                                sign-up rates and trends
                            </li>
                            <li>
                                • <strong>Attendance Rates:</strong> Monitor
                                actual vs. registered attendance
                            </li>
                            <li>
                                • <strong>Engagement Analytics:</strong> Measure
                                participant interaction during events
                            </li>
                            <li>
                                • <strong>Feedback Collection:</strong> Gather
                                post-event surveys and ratings
                            </li>
                            <li>
                                • <strong>Revenue Tracking:</strong> Monitor
                                paid event performance
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
                            • <strong>Early Planning:</strong> Create events
                            well in advance to allow for proper promotion
                        </li>
                        <li>
                            • <strong>Clear Descriptions:</strong> Provide
                            detailed event information to attract the right
                            audience
                        </li>
                        <li>
                            • <strong>Capacity Planning:</strong> Set realistic
                            participant limits based on venue or platform
                            capabilities
                        </li>
                        <li>
                            • <strong>Status Management:</strong> Keep event
                            status current to maintain accurate participant
                            expectations
                        </li>
                        <li>
                            • <strong>Follow-up Strategy:</strong> Plan
                            post-event communication to maintain engagement
                        </li>
                        <li>
                            • <strong>Technical Preparation:</strong> Test
                            streaming and recording capabilities before live
                            events
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EventManagement
