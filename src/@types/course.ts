import type { Membership } from './membership'

export interface CreateCourseRequest {
    course_name: string
    course_description: string
    instructions: string
    landing_page_url: string
    trailer_asset_id: number
    course_type: 'self_paced' | 'instructor_led'
    status: 'draft' | 'published' | 'archived'
    modules: {
        title: string
        description: string
    }[]
    membership_plans: {
        id: number
        name: string
        price: number
        isFree: boolean
        description: string
        payment_type: 'one_off' | 'recurring'
        price_point: 'course' | 'podcast' | 'standalone'
        billing: 'per-day' | 'package'
    }[]
}

export interface CreateCourseResponse {
    id: number
    moduleIds: number[]
}

// Module type
export interface Module {
    id?: number
    title: string
    description?: string
    order: number
    course_id?: number
}

// Lesson type
export interface Lesson {
    lesson: {
        id: number
        module_id: number
        title: string
        description: string
        content: string
        video_asset_id: number
        lesson_duration: number
        order: number
        created_at: string
        updated_at: string
    }
    video: null
    host: {
        name: string
        email: string
        profile_image: string
        id: number
    }
}

// Progress type
export interface Progress {
    lesson_id: number
    status: 'not_started' | 'in_progress' | 'completed'
    progress_percentage: number
    last_position: number
}

// Archive course request
export interface ArchiveCourseRequest {
    status: 'draft' | 'published' | 'archived'
    id: number
}

// Module API responses
export interface CreateModuleResponse {
    id: number
}

// Lesson API responses
export interface CreateLessonResponse {
    id: number
}

// Progress API responses
export interface UpdateProgressResponse {
    id: number
}

// Membership update/delete request
export interface UpdateCourseMembershipsRequest {
    membershipIds: number[]
}

// Membership delete response
export interface DeleteCourseMembershipsResponse {
    message: string
}

// Course main type (minimal, extend as needed)
export interface Course {
    id: number
    course_name: string
    course_description: string
    instructions?: string
    landing_page_url?: string
    trailer_asset_id: number
    course_type: 'self_paced' | 'instructor_led'
    status: 'draft' | 'published' | 'archived'
    course?: {
        id: number
        course_name: string
        course_description: string
        course_type: 'self_paced' | 'instructor_led'
        status: 'draft' | 'published' | 'archived'
        trailer_asset_id: number
        host_id: number
        instructions?: string
        landing_page_url?: string
        created_at: string
        updated_at: string
    }
    host?: {
        name: string
        email: string
        profile_image: string
    }
    cover?: {
        id: number
        asset_name: string
        asset_type: string
        content_type: string
        asset_url: string
        asset_size: string
        duration: number
        hls_url: string | null
        processing_status: string
        upload_id: string | null
        upload_status: string
        user_id: number
        created_at: string
        updated_at: string
    }
    // Add more fields as needed
}

export interface CourseWithDetails {
    course: {
        id: number
        course_name: string
        course_description: string
        course_type: 'self_paced' | 'instructor_led'
        status: 'draft' | 'published' | 'archived'
        trailer_asset_id: number
        host_id: number
        instructions: string
        landing_page_url: string
        created_at: string
        updated_at: string
    }
    cover?: {
        id: number
        asset_name: string
        asset_type: string
        content_type: string
        asset_url: string
        asset_size: string
        duration: number
        hls_url: string | null
        processing_status: string
        upload_id: string | null
        upload_status: string
        user_id: number
        created_at: string
        updated_at: string
    }
    host: {
        name: string
        email: string
        profile_image: string
        id: number
    }
    memberships?: {
        id: number
        name: string
        description: string
        price: number
        payment_type: 'one_off' | 'recurring'
        price_point: 'course' | 'podcast' | 'standalone'
        billing: 'per-day' | 'package'
        created_at: string
        updated_at: string
        user_id: number
    }[]
    modules?: {
        id: number
        title: string
        description: string
        order: number
        lessons: {
            id: number
            title: string
            description: string
            content: string
            created_at: string
            updated_at: string
            video: {
                id: number
                asset_name: string
                asset_type: string
                content_type: string
                asset_url: string
                asset_size: string
                duration: number
                hls_url: string | null
                processing_status: string
                upload_id: string | null
                upload_status: string
                user_id: number
                created_at: string
                updated_at: string
            } | null
            lesson_duration: number
            order: number
        }[]
    }[]
}

export interface GetCoursesResponse {
    courses: Course[]
    total: number
}

export interface CourseQueryParams {
    page?: number
    limit?: number
    search?: string
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>

export interface CourseMembershipsResponse {
    memberships: Membership[]
}
