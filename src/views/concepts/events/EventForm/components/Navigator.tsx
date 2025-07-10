import Avatar from '@/components/ui/Avatar'
// eslint-disable-next-line import/named
import { Link } from 'react-scroll'
import {
    TbUserSquare,
    TbMapPin,
    TbPhone,
    TbCalendar,
    TbArrowUpRight,
    TbFile,
    TbInfoCircle,
    TbCreditCard,
} from 'react-icons/tb'

const navigationList = [
    {
        label: 'Event details',
        description:
            'Enter event information like name, description, type, etc.',
        link: 'eventDetails',
        icon: <TbInfoCircle />,
    },
    {
        label: 'Event assets',
        description: 'Add assets to the event.',
        link: 'eventAssets',
        icon: <TbFile />,
    },
    {
        label: 'Price plans',
        description: 'Add price plans to the event.',
        link: 'pricePlans',
        icon: <TbCreditCard />,
    },
]

const editModeNavigationList = [
    {
        label: 'Leads registered',
        description: '0 so far',
        link: 'customerDetails',
        icon: <TbUserSquare />,
    },
    {
        label: 'Attended event',
        description: '0 so far',
        link: 'addressInformation',
        icon: <TbMapPin />,
    },
    {
        label: 'Instant callback',
        description: '0 so far',
        link: 'payment',
        icon: <TbPhone />,
    },
    {
        label: 'Scheduled Callback',
        description: '0 so far',
        link: 'payment',
        icon: <TbCalendar />,
    },
    {
        label: 'Upgrade Clicks',
        description: '6 hits so far',
        link: 'payment',
        icon: <TbArrowUpRight />,
    },
]

const Navigator = ({ newEvent }: { newEvent: boolean }) => {
    return (
        <div className="flex flex-col gap-2">
            {newEvent
                ? navigationList.map((nav) => (
                      <Link
                          key={nav.label}
                          activeClass="bg-gray-100 dark:bg-gray-700 active"
                          className="cursor-pointer p-4 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700"
                          to={nav.link}
                          spy={true}
                          smooth={true}
                          duration={500}
                          offset={-80}
                      >
                          <span className="flex items-center gap-2">
                              <Avatar
                                  icon={nav.icon}
                                  className="bg-gray-100 dark:bg-gray-700 group-hover:bg-white group-[.active]:bg-white dark:group-hover:bg-gray-800 dark:group-[.active]:bg-gray-800 text-gray-900 dark:text-gray-100"
                              />
                              <span className="flex flex-col flex-1">
                                  <span className="heading-text font-bold">
                                      {nav.label}
                                  </span>
                                  <span>{nav.description}</span>
                              </span>
                          </span>
                      </Link>
                  ))
                : editModeNavigationList.map((nav) => (
                      <Link
                          key={nav.label}
                          activeClass="bg-gray-100 dark:bg-gray-700 active"
                          className="cursor-pointer p-4 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-700"
                          to={nav.link}
                          spy={true}
                          smooth={true}
                          duration={500}
                          offset={-80}
                      >
                          <span className="flex items-center gap-2">
                              <Avatar
                                  icon={nav.icon}
                                  className="bg-gray-100 dark:bg-gray-700 group-hover:bg-white group-[.active]:bg-white dark:group-hover:bg-gray-800 dark:group-[.active]:bg-gray-800 text-gray-900 dark:text-gray-100"
                              />
                              <span className="flex flex-col flex-1">
                                  <span className="heading-text font-bold">
                                      {nav.label}
                                  </span>
                                  <span>{nav.description}</span>
                              </span>
                          </span>
                      </Link>
                  ))}
        </div>
    )
}

export default Navigator
