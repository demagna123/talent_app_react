import { useId } from "react"
import type { TextareaHTMLAttributes } from "react"
import "../Input/Input.css"

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string
    error?: string
}

export default function Textarea({ label, error, className = "", ...rest }: TextareaProps) {
    const id = useId()
    return (
        <div className="field">
            <label htmlFor={id}>
                {label}
                {rest.required && <span className="field-required"> *</span>}
            </label>
            <textarea
                id={id}
                rows={5}
                className={`field-control ${error ? "field-control-error" : ""} ${className}`.trim()}
                aria-invalid={!!error}
                {...rest}
            />
            {error && <p className="field-error">{error}</p>}
        </div>
    )
}