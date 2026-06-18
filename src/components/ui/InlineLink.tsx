import { Link, type LinkProps } from 'react-router'

/** Underlined uppercase inline link (e.g. SIGN UP, LOG IN, RECOVER ACCOUNT). */
export default function InlineLink({ children, className = '', ...rest }: LinkProps) {
    return (
        <Link
            {...rest}
            className={`ab-label inline-flex items-center border-b border-ink py-[2px] text-ink ${className}`}
        >
            {children}
        </Link>
    )
}
