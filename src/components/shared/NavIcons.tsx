/**
 * Sidebar navigation icons, taken straight from the Figma design.
 * Each icon keeps its own brand accent fill (coral / blue / yellow / green),
 * matching the source file regardless of the active state.
 */
import mark from '@/assets-ab/logo-mark.png'

type IconProps = { className?: string }

export function BusinessIcon({ className }: IconProps) {
    return (
        <svg
            aria-hidden
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M0.999787 11.0002H1.99979V18.0002C1.99979 19.1032 2.89679 20.0002 3.99979 20.0002H15.9998C17.1028 20.0002 17.9998 19.1032 17.9998 18.0002V11.0002H18.9998C19.1975 11.0002 19.3908 10.9415 19.5552 10.8316C19.7197 10.7217 19.8478 10.5656 19.9235 10.3829C19.9991 10.2002 20.0189 9.99912 19.9804 9.80517C19.9418 9.61122 19.8466 9.43305 19.7068 9.2932L10.7068 0.293201C10.614 0.200255 10.5038 0.126518 10.3825 0.0762068C10.2612 0.0258961 10.1311 0 9.99979 0C9.86845 0 9.73841 0.0258961 9.61709 0.0762068C9.49578 0.126518 9.38558 0.200255 9.29279 0.293201L0.292787 9.2932C0.152977 9.43305 0.057771 9.61122 0.0192035 9.80517C-0.0193641 9.99912 0.000438951 10.2002 0.076109 10.3829C0.151779 10.5656 0.279918 10.7217 0.444328 10.8316C0.608738 10.9415 0.802037 11.0002 0.999787 11.0002ZM7.99979 18.0002V13.0002H11.9998V18.0002H7.99979ZM9.99979 2.4142L15.9998 8.4142L16.0008 18.0002H13.9998V13.0002C13.9998 11.8972 13.1028 11.0002 11.9998 11.0002H7.99979C6.89679 11.0002 5.99979 11.8972 5.99979 13.0002V18.0002H3.99979V8.4142L9.99979 2.4142Z"
                fill="#EC8370"
            />
        </svg>
    )
}

export function DocumentsIcon({ className }: IconProps) {
    return (
        <svg
            aria-hidden
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path d="M12 2L22 8L12 14L2 8L12 2Z" fill="#286CD2" />
            <path
                d="M2 12L12 18L22 12"
                stroke="#286CD2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 16L12 22L22 16"
                stroke="#286CD2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function SupportIcon({ className }: IconProps) {
    return (
        <svg
            aria-hidden
            className={className}
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
        >
            <path
                d="M15.903 6.586C15.8556 6.47747 15.7892 6.37825 15.707 6.293L9.707 0.293C9.62175 0.210782 9.52253 0.144411 9.414 0.0969999C9.384 0.0829999 9.352 0.0749999 9.32 0.0639999C9.23633 0.0355262 9.14922 0.0183742 9.061 0.013C9.04 0.011 9.021 0 9 0H2C0.897 0 0 0.897 0 2V18C0 19.103 0.897 20 2 20H14C15.103 20 16 19.103 16 18V7C16 6.979 15.989 6.96 15.987 6.938C15.9821 6.84972 15.9649 6.76255 15.936 6.679C15.926 6.647 15.917 6.616 15.903 6.586ZM12.586 6H10V3.414L12.586 6ZM2 18V2H8V7C8 7.26522 8.10536 7.51957 8.29289 7.70711C8.48043 7.89464 8.73478 8 9 8H14L14.002 18H2Z"
                fill="#FFF8A7"
            />
            <path
                d="M4 10H12V12H4V10ZM4 14H12V16H4V14ZM4 6H6V8H4V6Z"
                fill="#FFF8A7"
            />
        </svg>
    )
}

export function TeamIcon({ className }: IconProps) {
    return (
        <svg
            aria-hidden
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
        >
            <path
                d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM17.931 9H11V2.069C12.7598 2.29335 14.3953 3.09574 15.6498 4.3502C16.9043 5.60466 17.7066 7.24017 17.931 9ZM2 10C2 5.928 5.061 2.564 9 2.069V10C9.00296 10.1526 9.04093 10.3024 9.111 10.438C9.126 10.468 9.133 10.501 9.152 10.531L13.354 17.254C12.3038 17.7442 11.159 17.9988 10 18C5.589 18 2 14.411 2 10ZM15.052 16.196L11.805 11H17.931C17.6746 13.0376 16.6436 14.8982 15.052 16.196Z"
                fill="#C2ECB0"
            />
        </svg>
    )
}

export function ApplicationsIcon({ className }: IconProps) {
    return (
        <img
            aria-hidden
            src={mark}
            alt=""
            className={className ?? 'h-5 w-5 object-contain'}
            draggable={false}
        />
    )
}
