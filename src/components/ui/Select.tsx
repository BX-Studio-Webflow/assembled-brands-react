import ReactSelect, {
    components,
    type DropdownIndicatorProps,
    type GroupBase,
    type StylesConfig,
} from 'react-select'
import { LuChevronDown } from 'react-icons/lu'
import { cx } from '@/lib/utils'

export type Option = { label: string; value: string }

type Props = {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    error?: boolean
    isSearchable?: boolean
    inputId?: string
    className?: string
}

const ink = '#262626'
const offwhite = '#fffbf5'
/** Figma option / chevron highlight (node 3458:829) */
const selectHighlight = '#f1e8da'
const mutedText = 'rgba(38,38,38,0.7)'

function DropdownIndicator(
    props: DropdownIndicatorProps<Option, false, GroupBase<Option>>,
) {
    const open = props.selectProps.menuIsOpen
    return (
        <components.DropdownIndicator {...props}>
            <span
                aria-hidden
                className="mr-1 flex size-7 shrink-0 items-center justify-center"
            >
                <LuChevronDown
                    className={cx(
                        'size-4 text-ink transition-transform duration-200',
                        open && 'rotate-180',
                    )}
                />
            </span>
        </components.DropdownIndicator>
    )
}

function makeStyles(
    error?: boolean,
): StylesConfig<Option, false, GroupBase<Option>> {
    const borderColor = error ? '#ec8370' : ink

    return {
        control: (base, state) => ({
            ...base,
            backgroundColor: offwhite,
            borderRadius: 0,
            minHeight: 60,
            height: 60,
            paddingLeft: 0,
            paddingRight: 0,
            borderColor,
            borderWidth: 1,
            borderStyle: 'solid',
            borderBottomColor: state.menuIsOpen ? 'transparent' : borderColor,
            boxShadow: 'none',
            cursor: 'pointer',
            ':hover': {
                borderColor,
                borderBottomColor: state.menuIsOpen ? 'transparent' : borderColor,
            },
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '12px 9px',
            gap: 10,
        }),
        placeholder: (base) => ({
            ...base,
            color: mutedText,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        }),
        singleValue: (base) => ({
            ...base,
            color: mutedText,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        }),
        input: (base) => ({
            ...base,
            color: ink,
            fontSize: 14,
            fontWeight: 500,
            margin: 0,
            padding: 0,
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            color: ink,
            ':hover': { color: ink },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: offwhite,
            borderRadius: 0,
            border: `1px solid ${borderColor}`,
            borderTop: 'none',
            marginTop: -1,
            marginBottom: 0,
            overflow: 'hidden',
            boxShadow: 'none',
            zIndex: 30,
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
        }),
        option: (base, state) => ({
            ...base,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: mutedText,
            padding: 24,
            cursor: 'pointer',
            backgroundColor:
                state.isFocused || state.isSelected
                    ? selectHighlight
                    : 'transparent',
            ':active': {
                backgroundColor: selectHighlight,
            },
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: mutedText,
            fontSize: 14,
            padding: 24,
        }),
    }
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = 'Select one',
    error,
    isSearchable = false,
    inputId,
    className,
}: Props) {
    const selected = options.find((o) => o.value === value) ?? null

    return (
        <div className={className}>
            <ReactSelect<Option, false, GroupBase<Option>>
                inputId={inputId}
                options={options}
                value={selected}
                placeholder={placeholder}
                isSearchable={isSearchable}
                styles={makeStyles(error)}
                components={{ DropdownIndicator }}
                menuPlacement="bottom"
                menuPosition="absolute"
                onChange={(opt) => onChange(opt?.value ?? '')}
            />
        </div>
    )
}
