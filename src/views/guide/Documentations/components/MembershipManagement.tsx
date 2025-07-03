import { Card } from '@/components/ui'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUsers,
    HiOutlineCreditCard,
    HiOutlineLockClosed,
    HiOutlineStar,
    HiOutlineCalendar,
} from 'react-icons/hi'

const MembershipManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Membership Management</h3>
                <p className="mb-4">
                    The Membership Management system allows you to create and
                    manage different membership tiers, control access to premium
                    content, and handle subscription-based services. Manage user
                    access levels, payment processing, and membership benefits
                    effectively.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Membership Tiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineStar className="text-xl text-yellow-500" />
                            <h5 className="font-semibold">Basic</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Entry-level membership with access to basic content,
                            limited features, and standard support.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineStar className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Premium</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Mid-tier membership with enhanced features, priority
                            content access, and improved support.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineStar className="text-xl text-purple-500" />
                            <h5 className="font-semibold">VIP</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Top-tier membership with exclusive content, premium
                            features, and dedicated support.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Creating a Membership</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlus className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Step 1: Access Membership Creation
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Navigate to{' '}
                            <strong>
                                Concepts → Memberships → Membership Create
                            </strong>{' '}
                            or click the "Create Membership" button from the
                            membership list.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Step 2: Fill Membership Details
                            </h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm">
                                <strong>Basic Information:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Membership Name:</strong>{' '}
                                    Descriptive name for the membership tier
                                </li>
                                <li>
                                    • <strong>Description:</strong> Detailed
                                    overview of benefits and features
                                </li>
                                <li>
                                    • <strong>Price:</strong> Monthly or annual
                                    subscription cost
                                </li>
                                <li>
                                    • <strong>Duration:</strong> Billing cycle
                                    (monthly, quarterly, annually)
                                </li>
                            </ul>
                            <p className="text-sm">
                                <strong>Access Control:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Content Access:</strong> Which
                                    courses, podcasts, and events are included
                                </li>
                                <li>
                                    • <strong>Feature Access:</strong> Premium
                                    features available to members
                                </li>
                                <li>
                                    • <strong>Support Level:</strong> Type and
                                    priority of customer support
                                </li>
                                <li>
                                    • <strong>Status:</strong> Active, Inactive,
                                    or Coming Soon
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Membership Features & Benefits</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineLockClosed className="text-xl text-green-500" />
                            <h5 className="font-semibold">Content Access</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Control what content members can access:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Course Access:</strong> Specific
                                    courses available to each tier
                                </li>
                                <li>
                                    • <strong>Podcast Episodes:</strong>{' '}
                                    Exclusive podcast content
                                </li>
                                <li>
                                    • <strong>Event Access:</strong> Premium
                                    events and workshops
                                </li>
                                <li>
                                    • <strong>Downloadable Resources:</strong>{' '}
                                    Exclusive files and materials
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Community Features
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Enhanced community and networking features:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Private Forums:</strong> Exclusive
                                    discussion areas
                                </li>
                                <li>
                                    • <strong>Direct Messaging:</strong>{' '}
                                    Communication with other members
                                </li>
                                <li>
                                    • <strong>Networking Events:</strong>{' '}
                                    Member-only meetups and events
                                </li>
                                <li>
                                    • <strong>Mentorship Programs:</strong>{' '}
                                    Access to industry experts
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineStar className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Premium Features</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Exclusive features for higher-tier members:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Priority Support:</strong> Faster
                                    response times
                                </li>
                                <li>
                                    • <strong>Custom Content:</strong>{' '}
                                    Personalized recommendations
                                </li>
                                <li>
                                    • <strong>Advanced Analytics:</strong>{' '}
                                    Detailed progress tracking
                                </li>
                                <li>
                                    • <strong>Exclusive Tools:</strong> Premium
                                    software and resources
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Managing Memberships</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Viewing Memberships
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the membership list at{' '}
                            <strong>
                                Concepts → Memberships → Membership List
                            </strong>
                            . The table displays all membership tiers with their
                            pricing, features, and member count.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Editing Memberships
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the edit icon (pencil) to modify membership
                            details. You can update pricing, features, access
                            permissions, and other settings.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">
                                Deleting Memberships
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the delete icon (trash) to remove a membership
                            tier. A confirmation dialog will appear to prevent
                            accidental deletions.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Payment & Billing</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineCreditCard className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Payment Processing
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Integrated payment processing for membership
                                subscriptions:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Secure Payments:</strong>{' '}
                                    Encrypted payment processing
                                </li>
                                <li>
                                    • <strong>Multiple Payment Methods:</strong>{' '}
                                    Credit cards, PayPal, and other options
                                </li>
                                <li>
                                    • <strong>Automatic Billing:</strong>{' '}
                                    Recurring payments for subscriptions
                                </li>
                                <li>
                                    • <strong>Payment History:</strong> Track
                                    all payment transactions
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineCalendar className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Billing Cycles</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Flexible billing options for different
                                membership needs:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Monthly Billing:</strong>{' '}
                                    Recurring monthly payments
                                </li>
                                <li>
                                    • <strong>Annual Billing:</strong> Yearly
                                    payments with potential discounts
                                </li>
                                <li>
                                    • <strong>Quarterly Billing:</strong>{' '}
                                    Three-month payment cycles
                                </li>
                                <li>
                                    • <strong>One-time Payments:</strong>{' '}
                                    Lifetime access options
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Member Management</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">Member Tracking</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Monitor and manage membership subscriptions:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Active Members:</strong> Track
                                    current subscription status
                                </li>
                                <li>
                                    • <strong>Payment Status:</strong> Monitor
                                    successful and failed payments
                                </li>
                                <li>
                                    • <strong>Renewal Tracking:</strong> Track
                                    upcoming renewals and expirations
                                </li>
                                <li>
                                    • <strong>Usage Analytics:</strong> Monitor
                                    member engagement and activity
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineCalendar className="text-xl text-orange-500" />
                            <h5 className="font-semibold">
                                Subscription Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Handle subscription changes and cancellations:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Upgrades/Downgrades:</strong>{' '}
                                    Change membership tiers
                                </li>
                                <li>
                                    • <strong>Pause Subscriptions:</strong>{' '}
                                    Temporarily suspend memberships
                                </li>
                                <li>
                                    • <strong>Cancellations:</strong> Process
                                    membership cancellations
                                </li>
                                <li>
                                    • <strong>Refunds:</strong> Handle refund
                                    requests and processing
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Access Control & Permissions</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineLockClosed className="text-xl text-red-500" />
                            <h5 className="font-semibold">
                                Content Restrictions
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Control access to premium content based on
                                membership level:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Course Restrictions:</strong>{' '}
                                    Limit access to specific courses
                                </li>
                                <li>
                                    • <strong>Podcast Restrictions:</strong>{' '}
                                    Control episode access
                                </li>
                                <li>
                                    • <strong>Event Restrictions:</strong> Limit
                                    event participation
                                </li>
                                <li>
                                    • <strong>File Restrictions:</strong>{' '}
                                    Control downloadable content access
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-green-500" />
                            <h5 className="font-semibold">Feature Access</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Manage feature availability by membership tier:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Advanced Features:</strong>{' '}
                                    Premium tools and functionality
                                </li>
                                <li>
                                    • <strong>Support Levels:</strong> Different
                                    support response times
                                </li>
                                <li>
                                    • <strong>Analytics Access:</strong>{' '}
                                    Detailed reporting and insights
                                </li>
                                <li>
                                    • <strong>Community Access:</strong>{' '}
                                    Exclusive forums and groups
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Membership Analytics</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Track membership performance and growth:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Subscription Metrics:</strong> Track
                                sign-ups, renewals, and cancellations
                            </li>
                            <li>
                                • <strong>Revenue Analytics:</strong> Monitor
                                subscription revenue and growth
                            </li>
                            <li>
                                • <strong>Member Engagement:</strong> Track
                                content consumption and activity
                            </li>
                            <li>
                                • <strong>Churn Analysis:</strong> Identify
                                reasons for membership cancellations
                            </li>
                            <li>
                                • <strong>Tier Performance:</strong> Compare
                                different membership levels
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
                            • <strong>Clear Value Proposition:</strong> Ensure
                            each tier provides clear value
                        </li>
                        <li>
                            • <strong>Pricing Strategy:</strong> Set competitive
                            prices that reflect value
                        </li>
                        <li>
                            • <strong>Content Quality:</strong> Maintain
                            high-quality content for all tiers
                        </li>
                        <li>
                            • <strong>Regular Updates:</strong> Keep content
                            fresh and relevant
                        </li>
                        <li>
                            • <strong>Member Support:</strong> Provide excellent
                            customer service
                        </li>
                        <li>
                            • <strong>Engagement Strategy:</strong> Keep members
                            active and engaged
                        </li>
                        <li>
                            • <strong>Feedback Collection:</strong> Regularly
                            gather member feedback
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MembershipManagement
