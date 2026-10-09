import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import type { AuthSession, AuthUser } from "../data/models/User"

// Au chargement de la page, on retrouve la session sauvegardée (s'il y en a une)
function readStoredUser(): AuthUser | null {
    try {
        if (!localStorage.getItem("token")) return null
        const raw = localStorage.getItem("user")
        return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
        return null
    }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(readStoredUser)

    const login = useCallback((session: AuthSession) => {
        localStorage.setItem("token", session.accessToken)
        localStorage.setItem("refreshToken", session.refreshToken)
        localStorage.setItem("user", JSON.stringify(session.user))
        setUser(session.user)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        setUser(null)
    }, [])

    const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}