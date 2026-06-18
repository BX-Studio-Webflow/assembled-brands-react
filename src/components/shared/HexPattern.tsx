/**
 * Faint isometric / triangular line pattern echoing the Assembled Brands
 * hexagon mark. Used as a subtle decoration on the right edge of the auth card.
 */
export default function HexPattern({
    className = '',
    stroke = '#262626',
    opacity = 0.18,
}: {
    className?: string
    stroke?: string
    opacity?: number
}) {
    return (
        <svg
            aria-hidden
            className={className}
            viewBox="0 0 520 560"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <pattern
                    id="ab-iso"
                    width="104"
                    height="180"
                    patternUnits="userSpaceOnUse"
                    patternTransform="translate(0 0)"
                >
                    {/* one isometric cube cell drawn with thin strokes */}
                    <g
                        stroke={stroke}
                        strokeWidth="1"
                        opacity={opacity}
                        fill="none"
                    >
                        <polygon points="52,0 104,30 104,90 52,120 0,90 0,30" />
                        <line x1="52" y1="0" x2="52" y2="60" />
                        <line x1="52" y1="60" x2="0" y2="90" />
                        <line x1="52" y1="60" x2="104" y2="90" />
                        {/* offset cell for tessellation */}
                        <polygon points="52,90 104,120 104,180 52,210 0,180 0,120" />
                        <line x1="52" y1="90" x2="52" y2="150" />
                        <line x1="52" y1="150" x2="0" y2="180" />
                        <line x1="52" y1="150" x2="104" y2="180" />
                    </g>
                </pattern>
            </defs>
            <rect width="520" height="560" fill="url(#ab-iso)" />
        </svg>
    )
}
