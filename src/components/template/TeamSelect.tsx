import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetTeamDashboard } from '@/services/TeamService'
import useSWR from 'swr'
import type { GetTeamsResponse } from '@/@types/team'
import { Skeleton } from '../ui'

type Option = {
    value: string
    label: string
    imgPath: string
}

const { Control } = components

const CustomSelectOption = (props: OptionProps<Option>) => {
    return (
        <DefaultOption<Option>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar shape="circle" size={20} src={data.imgPath} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={18}
                    src={selected.imgPath}
                />
            )}
            {children}
        </Control>
    )
}

const TeamSelect = () => {
    const { data, isLoading, mutate } = useSWR<GetTeamsResponse>(
        ['/team/dashboard'],
        apiGetTeamDashboard,
        {
            revalidateOnFocus: true,
            revalidateIfStale: true,
            revalidateOnReconnect: true,
        },
    )

    // Transform team data to options format
    const teamOptions: Option[] =
        data?.my_teams?.map((team) => ({
            value: team.team_id.toString(),
            label: team.business.name,
            imgPath: team.business.logo,
        })) || []

    if (isLoading) {
        return (
            <div className="flex items-center gap-4">
                <div>
                    <Skeleton variant="circle" />
                </div>
                <Skeleton />
            </div>
        )
    }

    const handleChange = (selected: Option | null) => {
        if (selected) {
            localStorage.setItem('team_id', selected.value)
            // Refresh the data to get updated team-specific information
            mutate()
        }
    }

    // Get the currently selected team from localStorage, or undefined if no team is selected
    const currentTeamId = localStorage.getItem('team_id')
    const defaultOption =
        teamOptions.find((option) => option.value === currentTeamId) ||
        undefined

    return (
        <div>
            <Select<Option>
                options={teamOptions}
                components={{
                    Option: CustomSelectOption,
                    Control: CustomControl,
                }}
                value={defaultOption}
                className="mb-4"
                placeholder="Select a team"
                onChange={(value) => handleChange(value)}
            />
        </div>
    )
}

export default TeamSelect
