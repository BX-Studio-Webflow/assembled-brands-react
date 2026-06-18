import ReactSelect, {
    type StylesConfig,
    type GroupBase,
} from 'react-select'

export type Option = { label: string; value: string }

type Props = {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    error?: boolean
    isSearchable?: boolean
    inputId?: string
}

const ink = '#262626'
const offwhite = '#fffbf5'
const beige = '#f8f1e4'

function makeStyles(error?: boolean): StylesConfig<Option, false, GroupBase<Option>> {
    return {
        control: (base) => ({
            ...base,
            backgroundColor: offwhite,
            borderRadius: 0,
            minHeight: 60,
            paddingLeft: 0,
            borderColor: error ? '#ec8370' : ink,
            boxShadow: 'none',
            ':hover': { borderColor: error ? '#ec8370' : ink },
            cursor: 'pointer',
        }),
        valueContainer: (base) => ({ ...base, padding: '12px 9px' }),
        placeholder: (base) => ({
            ...base,
            color: 'rgba(38,38,38,0.7)',
            fontSize: 14,
            fontWeight: 500,
        }),
        singleValue: (base) => ({
            ...base,
            color: ink,
            fontSize: 14,
            fontWeight: 500,
        }),
        input: (base) => ({ ...base, color: ink, fontSize: 14 }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
            ...base,
            color: ink,
            borderRadius: '50%',
            margin: 6,
            padding: 6,
            backgroundColor: beige,
            ':hover': { color: ink, backgroundColor: '#efe6d4' },
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#fffdf8',
            borderRadius: 4,
            border: '1px solid rgba(38,38,38,0.12)',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(38,38,38,0.12)',
            zIndex: 30,
        }),
        option: (base, state) => ({
            ...base,
            fontSize: 14,
            fontWeight: 500,
            color: ink,
            cursor: 'pointer',
            backgroundColor: state.isSelected
                ? beige
                : state.isFocused
                  ? 'rgba(248,241,228,0.6)'
                  : 'transparent',
            ':active': { backgroundColor: beige },
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
}: Props) {
    const selected = options.find((o) => o.value === value) ?? null
    return (
        <ReactSelect<Option>
            inputId={inputId}
            options={options}
            value={selected}
            placeholder={placeholder}
            isSearchable={isSearchable}
            styles={makeStyles(error)}
            menuPlacement="auto"
            onChange={(opt) => onChange(opt?.value ?? '')}
        />
    )
}
