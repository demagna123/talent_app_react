import type { ReactNode } from "react"
import "./Alert.css"

type AlertProps = {
    type?: "success" | "error" | "info"
    children: ReactNode
    onClose?: () => void // si fourni, affiche un bouton de fermeture
}

export default function Alert({ type = "info", children, onClose }: AlertProps) {
    return (
        <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
            <div className="alert-content">{children}</div>
            {onClose && (
                <button type="button" className="alert-close" onClick={onClose} aria-label="Fermer">
                    ×
                </button>
            )}
        </div>
    )
}