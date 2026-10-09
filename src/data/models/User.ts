export type UserRole = "admin" | "user"

export type AuthUser = {
    id: number
    firstName: string
    lastName: string
    email: string
    role: UserRole
}

// Ce que renvoie POST /authentication/verify-otp (data[0])
export type AuthSession = {
    accessToken: string
    refreshToken: string
    user: AuthUser
}