export const questionList: Record<
    string,
    {
        title: string
        content: string
        defaultExpand: boolean
    }[]
> = {
    general: [
        {
            title: 'What is Yeebli?',
            content:
                'Yeebli is a comprehensive business management platform that helps you manage leads, events, courses, memberships, and more. It provides tools for growing your business and engaging with your audience.',
            defaultExpand: true,
        },
        {
            title: 'How do I get started with Yeebli?',
            content:
                'Getting started is easy! Simply sign up for an account, complete your profile setup, and start exploring the features. You can begin by adding your first lead or creating an event.',
            defaultExpand: false,
        },
        {
            title: 'Is Yeebli suitable for my business size?',
            content:
                "Yes! Yeebli is designed to scale with your business. Whether you're a solo entrepreneur or a large enterprise, our platform adapts to your needs with flexible pricing plans.",
            defaultExpand: false,
        },
        {
            title: 'Can I integrate Yeebli with other tools?',
            content:
                'Absolutely! Yeebli offers various integrations with popular tools like Stripe for payments, email marketing platforms, and more. Check our integrations page for the full list.',
            defaultExpand: false,
        },
    ],
    leads: [
        {
            title: 'How do I add a new lead?',
            content:
                'You can add leads manually through the Lead Management section, import them from a CSV file, or capture them through our web forms and landing pages.',
            defaultExpand: true,
        },
        {
            title: 'Can I track lead interactions?',
            content:
                "Yes! Yeebli tracks all interactions with your leads including emails, calls, meetings, and engagement with your content. This helps you understand your lead's journey.",
            defaultExpand: false,
        },
        {
            title: 'How do I qualify leads?',
            content:
                'Use our lead scoring system to automatically qualify leads based on their behavior, engagement, and profile information. You can also manually update lead status.',
            defaultExpand: false,
        },
        {
            title: 'Can I automate follow-ups?',
            content:
                'Definitely! Set up automated email sequences and follow-up reminders to nurture your leads without manual intervention.',
            defaultExpand: false,
        },
    ],
    events: [
        {
            title: 'How do I create an event?',
            content:
                'Navigate to the Event Management section and click "Create New Event". Fill in the details, set your pricing, and publish to start accepting registrations.',
            defaultExpand: true,
        },
        {
            title: 'Can I sell tickets online?',
            content:
                'Yes! Yeebli integrates with Stripe to process ticket sales securely. You can set different ticket types and pricing tiers.',
            defaultExpand: false,
        },
        {
            title: 'How do I manage event registrations?',
            content:
                'All registrations are automatically tracked in your event dashboard. You can view attendee lists, send communications, and manage check-ins.',
            defaultExpand: false,
        },
        {
            title: 'Can I create recurring events?',
            content:
                'Absolutely! You can set up recurring events with custom schedules, making it easy to manage regular meetups, classes, or workshops.',
            defaultExpand: false,
        },
    ],
    courses: [
        {
            title: 'How do I create an online course?',
            content:
                'Start by creating a new course in the Course Management section. Add your content, set up modules and lessons, and configure access settings.',
            defaultExpand: true,
        },
        {
            title: 'Can I sell courses individually or as bundles?',
            content:
                'Both! You can sell individual courses or create course bundles with multiple courses at a discounted price.',
            defaultExpand: false,
        },
        {
            title: 'How do students access their courses?',
            content:
                'Students receive login credentials and can access their purchased courses through our learning management system with progress tracking.',
            defaultExpand: false,
        },
        {
            title: 'Can I offer certificates upon completion?',
            content:
                'Yes! You can set up automatic certificate generation for students who complete your courses with customizable certificate templates.',
            defaultExpand: false,
        },
    ],
    billing: [
        {
            title: 'What payment methods do you accept?',
            content:
                'We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through Stripe.',
            defaultExpand: true,
        },
        {
            title: 'Can I change my subscription plan?',
            content:
                'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated accordingly.',
            defaultExpand: false,
        },
        {
            title: 'How do I view my billing history?',
            content:
                'Access your billing history in the Billing section of your account settings. You can download invoices and view payment details.',
            defaultExpand: false,
        },
        {
            title: 'Is there a setup fee?',
            content:
                'No setup fees! You only pay for your chosen subscription plan. We offer a free trial to get you started.',
            defaultExpand: false,
        },
    ],
}

export const questionCategory: Record<string, string> = {
    general: 'General Questions',
    leads: 'Lead Management',
    events: 'Event Management',
    courses: 'Course Management',
    billing: 'Billing & Payments',
}
