import { useId } from "react"
import type { SelectHTMLAttributes } from "react"
import "../Input/Input.css"

export type SelectOption = { value: string | number; label: string }

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string
    options: SelectOption[]
    placeholder?: string
    error?: string
}

export default function Select({ label, options, placeholder, error, className = "", ...rest }: SelectProps) {
    const id = useId()
    return (
        <div className="field">
            <label htmlFor={id}>
                {label}
                {rest.required && <span className="field-required"> *</span>}
            </label>
            <select
                id={id}
                className={`field-control ${error ? "field-control-error" : ""} ${className}`.trim()}
                aria-invalid={!!error}
                {...rest}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error && <p className="field-error">{error}</p>}
        </div>
    )
}