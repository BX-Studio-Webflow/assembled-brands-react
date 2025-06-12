import ApiService from './ApiService'
import type {
    Course,
    GetCoursesResponse,
    CourseQueryParams,
    CreateCourseRequest,
    UpdateCourseRequest,
    CourseMembershipsResponse,
    CourseWithDetails,
    Module,
    Lesson,
    Progress,
    ArchiveCourseRequest,
    CreateModuleResponse,
    CreateLessonResponse,
    UpdateProgressResponse,
    UpdateCourseMembershipsRequest,
    DeleteCourseMembershipsResponse,
} from '@/@types/course'

export async function apiGetCourses(params?: CourseQueryParams) {
    return ApiService.fetchDataWithAxios<GetCoursesResponse>({
        url: '/course',
        method: 'get',
        params,
    })
}

export async function apiGetCourse(id: number) {
    return ApiService.fetchDataWithAxios<CourseWithDetails>({
        url: `/course/${id}`,
        method: 'get',
    })
}

export async function apiCreateCourse(data: CreateCourseRequest) {
    return ApiService.fetchDataWithAxios<Course>({
        url: '/course',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiUpdateCourse(id: number, data: UpdateCourseRequest) {
    return ApiService.fetchDataWithAxios<Course>({
        url: `/course/${id}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteCourse(id: number) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/course/${id}`,
        method: 'delete',
    })
}

export async function apiGetCourseMemberships(id: number) {
    return ApiService.fetchDataWithAxios<CourseMembershipsResponse>({
        url: `/course/${id}/memberships`,
        method: 'get',
    })
}

export async function apiArchiveCourse(data: ArchiveCourseRequest) {
    return ApiService.fetchDataWithAxios<void>({
        url: '/course/archive',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiCreateModule(courseId: number, data: Module) {
    return ApiService.fetchDataWithAxios<CreateModuleResponse>({
        url: `/course/${courseId}/modules`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiUpdateModule(
    courseId: number,
    moduleId: number,
    data: Module,
) {
    return ApiService.fetchDataWithAxios<Module>({
        url: `/course/${courseId}/modules/${moduleId}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteModule(courseId: number, moduleId: number) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/course/${courseId}/modules/${moduleId}`,
        method: 'delete',
    })
}

export async function apiCreateLesson(
    courseId: number,
    moduleId: number,
    data: Lesson,
) {
    return ApiService.fetchDataWithAxios<CreateLessonResponse>({
        url: `/course/${courseId}/modules/${moduleId}/lessons`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiUpdateLesson(
    courseId: number,
    moduleId: number,
    lessonId: number,
    data: Lesson,
) {
    return ApiService.fetchDataWithAxios<Lesson>({
        url: `/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteLesson(
    courseId: number,
    moduleId: number,
    lessonId: number,
) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        method: 'delete',
    })
}

export async function apiUpdateProgress(data: Progress) {
    return ApiService.fetchDataWithAxios<UpdateProgressResponse>({
        url: '/course/progress',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetProgress() {
    return ApiService.fetchDataWithAxios<Progress[]>({
        url: '/course/progress',
        method: 'get',
    })
}

export async function apiGetLesson(
    courseId: number,
    moduleId: number,
    lessonId: number,
) {
    return ApiService.fetchDataWithAxios<Lesson>({
        url: `/course/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        method: 'get',
    })
}

export async function apiUpdateCourseMemberships(
    courseId: number,
    data: UpdateCourseMembershipsRequest,
) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/course/${courseId}/memberships`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteCourseMemberships(
    courseId: number,
    data: UpdateCourseMembershipsRequest,
) {
    return ApiService.fetchDataWithAxios<DeleteCourseMembershipsResponse>({
        url: `/course/${courseId}/memberships`,
        method: 'delete',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
