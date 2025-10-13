import Card from '@/components/ui/Card'
import type { ReactElement } from 'react'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'
import {
    PiDesktopDuotone,
    PiUserPlusDuotone,
    PiUploadDuotone,
    PiFolderOpenDuotone,
} from 'react-icons/pi'
import { Link } from 'react-router'

type TemplateItem = {
    title: string
    description: string
    icon: ReactElement
    color: string
    bg: string
    to: string
}

const EmptyState = () => {
    const items: TemplateItem[] = [
        {
            title: 'Create an Event',
            description:
                'Streamline your events to users with a dedicated platform.',
            icon: <PiDesktopDuotone className="text-xl" />,
            color: 'text-rose-500',
            bg: 'bg-rose-100 dark:bg-rose-500/20',
            to: '/concepts/event/event-create',
        },
        {
            title: 'Import Leads',
            description:
                'Import your leads from a CSV file from an external platform.',
            icon: <PiUploadDuotone className="text-xl" />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-500/20',
            to: '/concepts/lead/bulk-lead-create',
        },
        {
            title: 'Add Leads',
            description: 'Stay on top of your leads with a dedicated platform.',
            icon: <PiUserPlusDuotone className="text-xl" />,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-500/20',
            to: '/concepts/lead/lead-create',
        },

        {
            title: 'Upload Assets',
            description: 'Upload your files to our secure storage.',
            icon: <PiFolderOpenDuotone className="text-xl" />,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-500/20',
            to: '/concepts/file-manager',
        },
    ]

    return (
        <Card>
            <div className="p-4">
                <div className="mb-4 flex flex-col gap-1">
                    <h4>Get Started</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.to}
                            className="group text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`h-10 w-10 flex items-center justify-center rounded-md ${item.bg} ${item.color}`}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-base font-semibold leading-tight">
                                            {item.title}
                                        </p>
                                        <HiOutlineArrowNarrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default EmptyState
