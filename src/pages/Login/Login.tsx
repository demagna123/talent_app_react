import { useState } from "react"
import type { FormEvent } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
import axios from "axios"

import "./Login.css"
import { useAuth } from "../../providers/AuthContext"
import { authApi } from "../../api/services/authentication/authentication"
import Card from "../../components/Card/Card"
import Alert from "../../components/Alert/Alert"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"


type Step = "credentials" | "code"

// Message du backend, avec le nombre d'essais restants s'il est fourni
function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
        const body = error.response.data
        const left = body?.data?.[0]?.leftAttemps
        const base = body?.responseMessage ?? "Une erreur est survenue."
        return typeof left === "number" && left > 0 ? `${base} Tentatives restantes : ${left}.` : base
    }
    return "Le serveur est injoignable. Réessayez dans un instant."
}

export default function Login() {
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = (location.state as { from?: string } | null)?.from ?? "/dashboard"

    const [step, setStep] = useState<Step>("credentials")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [info, setInfo] = useState("")

    // Déjà connecté : inutile de rester ici
    if (user) return <Navigate to="/dashboard" replace />

    const handleCredentials = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setInfo("")

        try {
            await authApi.signIn(email.trim(), password)
            setStep("code")
            setInfo(`Un code à 6 chiffres a été envoyé à ${email.trim()}.`)
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleCode = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setInfo("")

        try {
            const session = await authApi.verifyOtp(email.trim(), code.trim())
            login(session)
            navigate(from, { replace: true })
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setLoading(true)
        setError("")
        setInfo("")

        try {
            await authApi.signIn(email.trim(), password)
            setInfo("Un nouveau code vient d'être envoyé.")
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        setStep("credentials")
        setCode("")
        setError("")
        setInfo("")
    }

    return (
        <main className="login-page">
            <Card title={step === "credentials" ? "Connexion recruteur" : "Confirmation"}>
                {error && (
                    <Alert type="error" onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}
                {info && <Alert type="info">{info}</Alert>}

                {step === "credentials" ? (
                    <form onSubmit={handleCredentials}>
                        <Input
                            label="Adresse e-mail"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Mot de passe"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" loading={loading}>
                            Continuer
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleCode}>
                        <Input
                            label="Code de confirmation"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            pattern="\d{6}"
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        />
                        <div className="login-actions">
                            <Button type="submit" loading={loading}>
                                Se connecter
                            </Button>
                            <Button variant="secondary" disabled={loading} onClick={handleResend}>
                                Renvoyer le code
                            </Button>
                            <Button variant="secondary" disabled={loading} onClick={handleBack}>
                                Retour
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </main>
    )
}