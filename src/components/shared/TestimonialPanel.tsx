import { useState } from 'react'
import buffyLogo from '@/assets-ab/testimonial-buffy.png'

type Slide = {
    quote: string
    brand: string
    industry: string
    logo?: string
}

const slides: Slide[] = [
    {
        quote: '“Assembled Brands rescued us from unnecessary fundraising and have been an incredibly flexible and accommodating partner. Our business couldn\u2019t be where it is without them.”',
        brand: 'Buffy',
        industry: 'Home Goods',
        logo: buffyLogo,
    },
    {
        quote: '“Working with Assembled Brands gave us the runway to scale inventory without giving up equity. Funding was fast and the terms actually made sense for a growing CPG brand.”',
        brand: 'JuneShine',
        industry: 'Beverage',
    },
    {
        quote: '“They understood our seasonality from day one. Flexible capital meant we could meet demand at our biggest retail launch yet \u2014 stress free.”',
        brand: 'no cow',
        industry: 'Food',
    },
]

function Arrow({ dir }: { dir: 'left' | 'right' }) {
    return (
        <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={dir === 'left' ? 'rotate-180' : ''}
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    )
}

export default function TestimonialPanel() {
    const [index, setIndex] = useState(0)
    const slide = slides[index]
    const go = (delta: number) =>
        setIndex((i) => (i + delta + slides.length) % slides.length)

    return (
        <div className="flex h-full max-h-[480px] w-full flex-col justify-between">
            <blockquote className="ab-h3">{slide.quote}</blockquote>

            <div className="flex flex-col gap-6">
                <hr className="border-0 border-t border-ink" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                        {slide.logo ? (
                            <img
                                src={slide.logo}
                                alt={slide.brand}
                                className="h-9 w-auto"
                                draggable={false}
                            />
                        ) : (
                            <span className="font-serif text-2xl font-medium text-ink">
                                {slide.brand}
                            </span>
                        )}
                        <span className="ab-label text-ink">
                            Industry: {slide.industry}
                        </span>
                    </div>

                    <div className="flex items-center gap-[13px]">
                        <button
                            type="button"
                            aria-label="Previous testimonial"
                            className="flex size-[52px] items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-offwhite"
                            onClick={() => go(-1)}
                        >
                            <Arrow dir="left" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next testimonial"
                            className="flex size-[52px] items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-offwhite"
                            onClick={() => go(1)}
                        >
                            <Arrow dir="right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
