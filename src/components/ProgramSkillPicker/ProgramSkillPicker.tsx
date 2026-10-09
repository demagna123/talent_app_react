import type { Skill, SkillCategory } from "../../data/models/Skill"
import "./ProgramSkillPicker.css"

// Format attendu par POST /programs (champ "skills")
export type ProgramSkillSelection = {
    skillId: number
    weight: number // 1 à 5
    isRequired: boolean
}

type ProgramSkillPickerProps = {
    skills: Skill[]
    value: ProgramSkillSelection[]
    onChange: (value: ProgramSkillSelection[]) => void
}

const CATEGORY_LABELS: Record<SkillCategory, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Base de données",
    tools: "Outils",
    other: "Autres",
}

export default function ProgramSkillPicker({ skills, value, onChange }: ProgramSkillPickerProps) {
    const findSelected = (id: number) => value.find((s) => s.skillId === id)

    const toggle = (id: number) => {
        if (findSelected(id)) {
            onChange(value.filter((s) => s.skillId !== id))
        } else {
            onChange([...value, { skillId: id, weight: 3, isRequired: false }])
        }
    }

    const update = (id: number, changes: Partial<ProgramSkillSelection>) => {
        onChange(value.map((s) => (s.skillId === id ? { ...s, ...changes } : s)))
    }

    const groups = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        ;(acc[skill.category] ??= []).push(skill)
        return acc
    }, {})

    return (
        <div>
            {Object.entries(groups).map(([category, items]) => (
                <fieldset key={category} className="psp-group">
                    <legend>{CATEGORY_LABELS[category as SkillCategory] ?? category}</legend>
                    {items.map((skill) => {
                        const selected = findSelected(skill.id)
                        return (
                            <div key={skill.id} className={`psp-row ${selected ? "psp-row-active" : ""}`}>
                                <label className="psp-check">
                                    <input type="checkbox" checked={!!selected} onChange={() => toggle(skill.id)} />
                                    <span>{skill.name}</span>
                                </label>

                                {selected && (
                                    <div className="psp-options">
                                        <label className="psp-weight">
                                            Poids
                                            <select
                                                value={selected.weight}
                                                onChange={(e) => update(skill.id, { weight: Number(e.target.value) })}
                                            >
                                                {[1, 2, 3, 4, 5].map((w) => (
                                                    <option key={w} value={w}>
                                                        {w}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="psp-required">
                                            <input
                                                type="checkbox"
                                                checked={selected.isRequired}
                                                onChange={(e) => update(skill.id, { isRequired: e.target.checked })}
                                            />
                                            Requise
                                        </label>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </fieldset>
            ))}
        </div>
    )
}