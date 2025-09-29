import { useState, useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import AbbreviateNumber from '@/components/shared/AbbreviateNumber'
import { useThemeStore } from '@/store/themeStore'
import classNames from '@/utils/classNames'
import { NumericFormat } from 'react-number-format'
import {
    TbCalendarCancel,
    TbCalendarEvent,
    TbCalendarUser,
} from 'react-icons/tb'
import type { ReactNode } from 'react'
import type { StatisticCategory } from '../types'
import type { DashboardResponse } from '@/@types/auth'

type StatisticCardProps = {
    title: string
    value: number | ReactNode
    icon: ReactNode
    iconClass: string
    label: StatisticCategory
    active: boolean
    onClick: (label: StatisticCategory) => void
}

type StatisticGroupsProps = {
    data: DashboardResponse | undefined
}

const StatisticCard = (props: StatisticCardProps) => {
    const { title, value, label, icon, iconClass, active, onClick } = props

    return (
        <button
            className={classNames(
                'p-4 rounded-2xl cursor-pointer ltr:text-left rtl:text-right transition duration-150 outline-hidden',
                active && 'bg-white dark:bg-gray-900 shadow-md',
            )}
            onClick={() => onClick(label)}
        >
            <div className="flex md:flex-col-reverse gap-2 2xl:flex-row justify-between relative">
                <div>
                    <div className="mb-4 text-sm font-semibold">{title}</div>
                    <h3 className="mb-1">{value}</h3>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                        iconClass,
                    )}
                >
                    {icon}
                </div>
            </div>
        </button>
    )
}

const Overview = ({ data }: StatisticGroupsProps) => {
    const [selectedCategory, setSelectedCategory] =
        useState<StatisticCategory>('totalEarned')

    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (!isFirstRender.current) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Event Count</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl p-3 bg-gray-100 dark:bg-gray-700 mt-4">
                <StatisticCard
                    title="Upcoming events"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={data?.event_counts?.upcoming || 0}
                            thousandSeparator={true}
                        />
                    }
                    iconClass="bg-sky-200"
                    icon={<TbCalendarEvent />}
                    label="totalEarned"
                    active={selectedCategory === 'totalEarned'}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Total events"
                    value={
                        <NumericFormat
                            displayType="text"
                            value={data?.event_counts?.total || 0}
                            thousandSeparator={true}
                        />
                    }
                    iconClass="bg-emerald-200"
                    icon={<TbCalendarUser />}
                    label="totalRegistration"
                    active={selectedCategory === 'totalRegistration'}
                    onClick={setSelectedCategory}
                />
                <StatisticCard
                    title="Cancelled events"
                    value={
                        <AbbreviateNumber
                            value={data?.event_counts?.cancelled || 0}
                        />
                    }
                    iconClass="bg-purple-200"
                    icon={<TbCalendarCancel />}
                    label="totalNonAttendee"
                    active={selectedCategory === 'totalNonAttendee'}
                    onClick={setSelectedCategory}
                />
            </div>
        </Card>
    )
}

export default Overview
