import { Card } from '@/components/ui'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineVideoCamera,
    HiOutlineCheckCircle,
} from 'react-icons/hi'

const CourseManagement = () => {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="mb-4">Course Management</h3>
                <p className="mb-4">
                    The Course Management system allows you to create
                    comprehensive educational courses with modules, lessons, and
                    various content types. Organize learning materials, track
                    student progress, and deliver structured educational content
                    to your audience.
                </p>
            </div>

            <div>
                <h4 className="mb-4">Course Structure</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineAcademicCap className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Courses</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            The main container for your educational content.
                            Each course can contain multiple modules and
                            lessons.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineBookOpen className="text-xl text-green-500" />
                            <h5 className="font-semibold">Modules</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Organized sections within a course that group
                            related lessons together for better learning flow.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Lessons</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Individual learning units that contain the actual
                            educational content, including text, videos, and
                            assessments.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Creating a Course</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlinePlus className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Step 1: Access Course Creation
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Navigate to{' '}
                            <strong>Concepts → Courses → Create Course</strong>{' '}
                            or click the &quot;Create Course&quot; button from the course
                            list.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Step 2: Fill Course Details
                            </h5>
                        </div>
                        <div className="ml-8 space-y-2">
                            <p className="text-sm">
                                <strong>Basic Information:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Course Name:</strong> Descriptive
                                    title for your course
                                </li>
                                <li>
                                    • <strong>Description:</strong> Detailed
                                    overview of what students will learn
                                </li>
                                <li>
                                    • <strong>Category:</strong> Organize
                                    courses by subject or topic
                                </li>
                                <li>
                                    • <strong>Difficulty Level:</strong>{' '}
                                    Beginner, Intermediate, or Advanced
                                </li>
                            </ul>
                            <p className="text-sm">
                                <strong>Course Settings:</strong>
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Duration:</strong> Estimated time
                                    to complete the course
                                </li>
                                <li>
                                    • <strong>Prerequisites:</strong> Any
                                    required knowledge or courses
                                </li>
                                <li>
                                    • <strong>Learning Objectives:</strong> What
                                    students will achieve
                                </li>
                                <li>
                                    • <strong>Status:</strong> Draft, Published,
                                    or Archived
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Adding Modules and Lessons</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineBookOpen className="text-xl text-green-500" />
                            <h5 className="font-semibold">Creating Modules</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Organize your course content into logical
                                modules:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Module Title:</strong> Clear,
                                    descriptive name for the module
                                </li>
                                <li>
                                    • <strong>Module Description:</strong>{' '}
                                    Overview of what the module covers
                                </li>
                                <li>
                                    • <strong>Module Order:</strong> Sequence
                                    within the course
                                </li>
                                <li>
                                    • <strong>Estimated Duration:</strong> Time
                                    to complete the module
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineDocumentText className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Adding Lessons</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Create individual lessons within each module:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Lesson Title:</strong> Specific
                                    topic or concept
                                </li>
                                <li>
                                    • <strong>Content Type:</strong> Text,
                                    Video, Audio, or Interactive
                                </li>
                                <li>
                                    • <strong>Lesson Content:</strong> The
                                    actual educational material
                                </li>
                                <li>
                                    • <strong>Lesson Order:</strong> Sequence
                                    within the module
                                </li>
                                <li>
                                    • <strong>Duration:</strong> Estimated time
                                    to complete
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Content Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Text Content</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Written lessons with rich text formatting, images,
                            and links. Perfect for theory, explanations, and
                            reference materials.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineVideoCamera className="text-xl text-green-500" />
                            <h5 className="font-semibold">Video Content</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Video lessons for demonstrations, lectures, and
                            visual learning. Supports various video formats and
                            streaming.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineCheckCircle className="text-xl text-purple-500" />
                            <h5 className="font-semibold">
                                Interactive Content
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Quizzes, assessments, and interactive exercises to
                            test knowledge and reinforce learning.
                        </p>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineDocumentText className="text-xl text-orange-500" />
                            <h5 className="font-semibold">
                                Downloadable Resources
                            </h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            PDFs, worksheets, templates, and other downloadable
                            materials to supplement learning.
                        </p>
                    </Card>
                </div>
            </div>

            <div>
                <h4 className="mb-4">Managing Courses</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineAcademicCap className="text-xl text-blue-500" />
                            <h5 className="font-semibold">Viewing Courses</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Access the course list at{' '}
                            <strong>Concepts → Courses → Courses List</strong>.
                            The table displays all courses with their details,
                            status, and action buttons.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlinePencil className="text-xl text-green-500" />
                            <h5 className="font-semibold">Editing Courses</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the edit icon (pencil) to modify course
                            details, add modules, or update content. You can
                            also manage course structure and settings.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineBookOpen className="text-xl text-purple-500" />
                            <h5 className="font-semibold">Course Details</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click on a course to view detailed information,
                            including modules, lessons, and student progress.
                        </p>

                        <div className="flex items-center gap-3">
                            <HiOutlineTrash className="text-xl text-red-500" />
                            <h5 className="font-semibold">Deleting Courses</h5>
                        </div>
                        <p className="text-sm text-gray-600">
                            Click the delete icon (trash) to remove a course. A
                            confirmation dialog will appear to prevent
                            accidental deletions.
                        </p>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Student Progress Tracking</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineUsers className="text-xl text-indigo-500" />
                            <h5 className="font-semibold">
                                Enrollment Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Track student enrollment and progress:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Enrollment Status:</strong> Track
                                    who is enrolled in each course
                                </li>
                                <li>
                                    • <strong>Progress Tracking:</strong>{' '}
                                    Monitor completion of modules and lessons
                                </li>
                                <li>
                                    • <strong>Assessment Results:</strong> Track
                                    quiz and test scores
                                </li>
                                <li>
                                    • <strong>Time Spent:</strong> Monitor how
                                    long students spend on content
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineCheckCircle className="text-xl text-green-500" />
                            <h5 className="font-semibold">
                                Completion Certificates
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Reward student achievement:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Course Completion:</strong> Issue
                                    certificates upon course completion
                                </li>
                                <li>
                                    • <strong>Module Completion:</strong> Track
                                    progress through individual modules
                                </li>
                                <li>
                                    • <strong>Assessment Passing:</strong>{' '}
                                    Recognize successful quiz completion
                                </li>
                                <li>
                                    • <strong>Progress Reports:</strong>{' '}
                                    Generate detailed progress analytics
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Content Management</h4>
                <Card className="mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <HiOutlineDocumentText className="text-xl text-blue-500" />
                            <h5 className="font-semibold">
                                Article Management
                            </h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Create and manage course articles:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Add Articles:</strong> Create new
                                    articles for courses
                                </li>
                                <li>
                                    • <strong>Edit Articles:</strong> Update
                                    existing content
                                </li>
                                <li>
                                    • <strong>Article Organization:</strong>{' '}
                                    Structure content logically
                                </li>
                                <li>
                                    • <strong>Content Formatting:</strong> Use
                                    rich text editing for better presentation
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3">
                            <HiOutlineVideoCamera className="text-xl text-green-500" />
                            <h5 className="font-semibold">Media Integration</h5>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Enhance courses with multimedia content:
                            </p>
                            <ul className="text-sm text-gray-600 ml-4 space-y-1">
                                <li>
                                    • <strong>Video Uploads:</strong> Add
                                    instructional videos
                                </li>
                                <li>
                                    • <strong>Audio Content:</strong> Include
                                    podcast-style lessons
                                </li>
                                <li>
                                    • <strong>Images and Graphics:</strong>{' '}
                                    Visual aids and diagrams
                                </li>
                                <li>
                                    • <strong>Interactive Elements:</strong>{' '}
                                    Embed interactive content
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h4 className="mb-4">Course Analytics</h4>
                <Card>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                            Track course performance and student engagement:
                        </p>
                        <ul className="text-sm text-gray-600 ml-4 space-y-1">
                            <li>
                                • <strong>Enrollment Metrics:</strong> Track
                                course sign-ups and completion rates
                            </li>
                            <li>
                                • <strong>Student Engagement:</strong> Monitor
                                time spent and interaction with content
                            </li>
                            <li>
                                • <strong>Assessment Performance:</strong> Track
                                quiz and test results
                            </li>
                            <li>
                                • <strong>Popular Content:</strong> Identify
                                which lessons and modules are most engaging
                            </li>
                            <li>
                                • <strong>Student Feedback:</strong> Collect and
                                analyze student reviews and ratings
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
                            • <strong>Clear Structure:</strong> Organize content
                            logically with clear modules and lessons
                        </li>
                        <li>
                            • <strong>Engaging Content:</strong> Use a mix of
                            text, video, and interactive elements
                        </li>
                        <li>
                            • <strong>Progressive Learning:</strong> Build
                            concepts progressively from basic to advanced
                        </li>
                        <li>
                            • <strong>Regular Assessments:</strong> Include
                            quizzes and tests to reinforce learning
                        </li>
                        <li>
                            • <strong>Student Support:</strong> Provide clear
                            instructions and support materials
                        </li>
                        <li>
                            • <strong>Content Updates:</strong> Keep course
                            content current and relevant
                        </li>
                        <li>
                            • <strong>Accessibility:</strong> Ensure content is
                            accessible to all students
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default CourseManagement
