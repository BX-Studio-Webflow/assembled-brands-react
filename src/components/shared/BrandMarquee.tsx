import marquee from '@/assets-ab/logo-marquee.png'

/** Dark partner-logo strip that scrolls continuously across the card footer. */
export default function BrandMarquee({ className = '' }: { className?: string }) {
    return (
        <div
            className={`w-full overflow-hidden bg-ink py-[22px] ${className}`}
            aria-label="Trusted by leading CPG brands"
        >
            <div className="ab-marquee-track">
                {[0, 1].map((i) => (
                    <img
                        key={i}
                        src={marquee}
                        alt={i === 0 ? 'Partner brand logos' : ''}
                        aria-hidden={i === 1}
                        className="h-8 w-auto max-w-none pr-12 opacity-90"
                        draggable={false}
                    />
                ))}
            </div>
        </div>
    )
}
