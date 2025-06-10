import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import type { ChangeEvent, Ref } from 'react'
import type { InputProps } from '@/components/ui/Input'

type DebouceInputProps = InputProps & {
    wait?: number
    ref?: Ref<HTMLInputElement>
}

const DebouceInput = (props: DebouceInputProps) => {
    const { wait = 500, ref, onChange, ...rest } = props

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Call onChange immediately to update the input value
        onChange?.(e)

        // Debounce the actual value update
        const debouncedFn = useDebounce(
            (value: ChangeEvent<HTMLInputElement>) => {
                onChange?.(value)
            },
            wait,
        )
        debouncedFn(e)
    }

    return <Input ref={ref} {...rest} onChange={handleInputChange} />
}

export default DebouceInput
