import { createContext, useContext } from "react"
import type { AuthSession, AuthUser } from "../data/models/User"

export type AuthContextValue = {
    user: AuthUser | null
    login: (session: AuthSession) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider")
    return context
}