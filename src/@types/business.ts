import { User } from './auth'

export interface Business {
    id: number
    name: string
    email: string
    phone: string
    dial_code: string
    address: string
    logo: string
}

export interface GetBusinessResponse {
    business: Business
    user: User
}

export interface UpdateBusinessRequest extends Record<string, unknown> {
    name: string
    address: string
    email: string
    dial_code: string
    phone: string
}
