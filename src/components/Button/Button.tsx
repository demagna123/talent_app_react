import type { ButtonHTMLAttributes, ReactNode } from "react"
import "./Button.css"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger"
    loading?: boolean
    children: ReactNode
}

export default function Button({
    variant = "primary",
    loading = false,
    disabled,
    children,
    className = "",
    type = "button",
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${className}`.trim()}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? "Envoi en cours…" : children}
        </button>
    )
}