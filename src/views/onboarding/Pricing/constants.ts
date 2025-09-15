export const featuresList: {
    id: string
    description: Record<string, string>
}[] = [
    {
        id: 'landingPages',
        description: {
            basic: 'Up to 10 Landing Pages',
            popular: 'Up to 10 Landing Pages',
            advanced: 'Up to 10 Landing Pages',
        },
    },
    {
        id: 'leadCollection',
        description: {
            basic: 'Collect leads from landing pages direct to CRM',
            popular: 'Collect leads from landing pages direct to CRM',
            advanced: 'Collect leads from landing pages direct to CRM',
        },
    },
    {
        id: 'leadCRM',
        description: {
            basic: 'CRM to manage Leads',
            popular: 'CRM to manage Leads',
            advanced: 'CRM to manage Leads',
        },
    },
    {
        id: 'cohortMessaging',
        description: {
            basic: 'Cohort messaging with tags',
            popular: 'Cohort messaging with tags',
            advanced: 'Cohort messaging with tags',
        },
    },
    {
        id: 'hostEvents',
        description: {
            basic: 'Host Events (Pre-recorded/Live/In-Person)',
            popular: 'Host Events (Pre-recorded/Live/In-Person)',
            advanced: 'Host Events (Pre-recorded/Live/In-Person)',
        },
    },
    {
        id: 'reminderEmails',
        description: {
            basic: 'Reminder email sequences',
            popular: 'Reminder email sequences',
            advanced: 'Reminder email sequences',
        },
    },
    {
        id: 'courseHosting',
        description: {
            basic: '',
            popular: 'Members area for Course hosting on website',
            advanced: 'Course hosting on website',
        },
    },
    {
        id: 'liveCommunity',
        description: {
            basic: '',
            popular: '',
            advanced: 'Members area for Live online Community Page',
        },
    },
]

export const questionList: Record<
    string,
    {
        title: string
        content: string
        defaultExpand: boolean
    }[]
> = {
    subscription: [
        {
            title: 'How do I sign up for a subscription?',
            content:
                'Select the plan above with your preferred subscription plan, and follow the on-screen instructions to create an account and enter your payment details.',
            defaultExpand: true,
        },
        {
            title: 'Can I cancel my subscription?',
            content:
                'Yes, you have the flexibility to cancel your subscription at any time. To cancel, simply log in to your account, navigate to the "Subscription" section, and follow the instructions to cancel your plan. Your cancellation will take effect at the end of your current billing cycle.',
            defaultExpand: false,
        },

        {
            title: 'Can I switch my subscription plan?',
            content:
                'Absolutely, you can switch between the monthly and annual plans at any time. To change your subscription plan, log in to your account, go to the "Subscription" section, select the plan you want to switch to, and follow the instructions. Your new plan will take effect immediately.',
            defaultExpand: false,
        },
        {
            title: 'Do you offer a free trial?',
            content:
                'Yes, we provide a 14-day free trial for new users. During this period, you can access all the features of our subscription plan. If you continue after the trial, you will be charged based on the plan you selected.',
            defaultExpand: false,
        },
        {
            title: 'How do I know when my subscription is about to renew?',
            content:
                'You will receive an email notification a few days before your subscription is set to renew, reminding you of the upcoming charge and providing an option to make any necessary changes.',
            defaultExpand: false,
        },
        {
            title: 'Are there any discounts for students or non-profits?',
            content:
                'Yes, we offer special discounts for students and non-profits. Please contact our support team with the relevant documentation to apply for these discounts.',
            defaultExpand: false,
        },
    ],
    billing: [
        {
            title: 'What payment methods do you accept?',
            content:
                'We strive to make the payment process as convenient as possible by accepting a variety of payment methods. These include major credit and debit cards such as Visa, MasterCard, and American Express, as well as PayPal. Depending on your location, additional regional payment methods may also be available.',
            defaultExpand: true,
        },
        {
            title: 'What happens if my payment fails?',
            content:
                'If your payment fails, we will notify you via email. You will then have a grace period of 7 days to update your payment information. If the payment issue is not resolved within this period, your subscription will be temporarily suspended until the payment is successfully processed.',
            defaultExpand: false,
        },
        {
            title: 'How do I update my payment information?',
            content:
                'To update your payment information, log in to your account, go to the "Billing" section, and enter your new payment details. Make sure to save the changes to ensure continuous service.',
            defaultExpand: false,
        },
        {
            title: 'Will I get a refund if I cancel my subscription?',
            content:
                'Refund policies vary depending on your subscription type. For our Monthly Plan, we do not offer refunds. However, for the Annual Plan, you may be eligible for a prorated refund if you cancel within the first 30 days of your subscription. Please contact our support team for assistance with this process.',
            defaultExpand: false,
        },
    ],
    others: [
        {
            title: 'How do I contact customer support?',
            content:
                'Our customer support team is here to help with any questions or issues you may have. You can reach us by emailing support@elevnt.io, calling our support line at 1-800-123-4567, or using the live chat feature on our website. We are committed to providing you with prompt and effective assistance.',
            defaultExpand: true,
        },
        {
            title: 'How do I change my account details?',
            content:
                'To update your account details, log in to your account, navigate to the "Security" section, and make the necessary changes. Be sure to save your updates.',
            defaultExpand: false,
        },
        {
            title: 'Is my personal information secure?',
            content:
                'Yes, we prioritize the security of your personal information. Our site uses industry-standard encryption and security measures. Please refer to our Privacy Policy for more details on how we protect your data.',
            defaultExpand: false,
        },
    ],
}

export const questionCategory: Record<string, string> = {
    subscription: 'Subscription details',
    billing: 'Billing and payments',
    others: 'Other',
}

export const pricingPlansData = {
    successUrl: `${window.location.origin}/dashboards/information?action=success`,
    cancelUrl: `${window.location.origin}/onboarding/pricing?action=cancelled`,
    featuresModel: [
        {
            id: '',
            description: '',
        },
    ],
    plans: [
        {
            id: 'basic',
            name: 'Basic',
            description:
                'Perfect for those who want to generate leads through a landing page while effortlessly managing events be it live, pre-recorded, or in-person experiences.',
            price: {
                monthly: 199,
                annually: 2388,
            },
            features: [
                'landingPages',
                'leadCollection',
                'leadCRM',
                'cohortMessaging',
                'hostEvents',
                'reminderEmails',
            ],
            production: {
                productId: 'prod_Sqdn0QZ7D4MAJA',
                priceIdMonthly: 'price_1S7fn1RQHG5W5P1LyPv4nRZ2',
                priceIdAnnually: 'price_1S7fmcRQHG5W5P1Lp0hxN0oL',
            },
            development: {
                productId: 'prod_S0AzGhVZfAqbc4',
                priceIdMonthly: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
                priceIdAnnually: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
            },
            recommended: false,
        },
        {
            id: 'popular',
            name: 'Popular',
            description:
                'Everything in basic, plus hosting paid courses',
            price: {
                monthly: 299,
                annually: 3588,
            },
            features: [
                'landingPages',
                'leadCollection',
                'leadCRM',
                'cohortMessaging',
                'hostEvents',
                'reminderEmails',
                'courseHosting',
            ],
            production: {
                productId: 'prod_SqdoIUD669T4aJ',
                priceIdMonthly: 'price_1S7fpYRQHG5W5P1LWpSbil66',
                priceIdAnnually: 'price_1S7fpxRQHG5W5P1LAhcDuF1M',
            },
            development: {
                productId: 'prod_S0AzGhVZfAqbc4',
                priceIdMonthly: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
                priceIdAnnually: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
            },
            recommended: true,
        },
        {
            id: 'advanced',
            name: 'Advanced',
            description:
                'Everything in popular plus live online community page',
            price: {
                monthly: 399,
                annually: 4788,
            },
            features: [
                'landingPages',
                'leadCollection',
                'leadCRM',
                'cohortMessaging',
                'hostEvents',
                'reminderEmails',
                'courseHosting',
                'liveCommunity',
            ],
            production: {
                productId: 'prod_Sqdo48NvmJyKBE',
                priceIdMonthly: 'price_1S7fqgRQHG5W5P1LYi15vGRu',
                priceIdAnnually: 'price_1S7fquRQHG5W5P1LVKjZknUU',
            },
            development: {
                productId: 'prod_S0AzGhVZfAqbc4',
                priceIdMonthly: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
                priceIdAnnually: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
            },
            recommended: false,
        },
    ],
}

export const subscriptionConfig = {
    production: {
        productId: 'prod_SB7HDumob3GYpw',
        priceIdMonthly: 'price_1RGl2xI0TpDVyeKFFuichoT9',
        priceIdAnnually: 'price_1RGl2xI0TpDVyeKFFuichoT9',
        successUrl: `${window.location.origin}/dashboards/information?action=success`,
        cancelUrl: `${window.location.origin}/onboarding/pricing?action=cancelled`,
    },
    development: {
        productId: 'prod_S0AzGhVZfAqbc4',
        priceIdMonthly: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
        priceIdAnnually: 'price_1RE7jXI0TpDVyeKFYO3CVtei',
        successUrl: `${window.location.origin}/dashboards/information?action=success`,
        cancelUrl: `${window.location.origin}/onboarding/pricing?action=cancelled`,
    },
}
