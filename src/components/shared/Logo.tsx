import { Link } from 'react-router'
import logo from '@/assets-ab/logo.png'

export default function Logo({ className = '' }: { className?: string }) {
    return (
        <Link to="/" aria-label="Assembled Brands home" className={className}>
            <img
                src={logo}
                alt="Assembled Brands"
                className="h-8 w-auto select-none"
                draggable={false}
            />
        </Link>
    )
}
