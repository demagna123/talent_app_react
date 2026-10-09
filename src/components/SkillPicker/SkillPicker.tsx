import type { SkillLevel } from "../../data/models/Application"
import type { Skill, SkillCategory } from "../../data/models/Skill"
import "./SkillPicker.css"

// Format attendu par POST /applications (champ "skills")
export type SelectedSkill = {
    skillId: number
    level: SkillLevel
}

type SkillPickerProps = {
    skills: Skill[]
    value: SelectedSkill[]
    onChange: (value: SelectedSkill[]) => void
    requiredSkillIds?: number[] // compétences requises par le programme (facultatif)
}

const CATEGORY_LABELS: Record<SkillCategory, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Base de données",
    tools: "Outils",
    other: "Autres",
}

const LEVEL_LABELS: Record<SkillLevel, string> = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
}

export default function SkillPicker({ skills, value, onChange, requiredSkillIds = [] }: SkillPickerProps) {
    const findSelected = (id: number) => value.find((s) => s.skillId === id)

    const toggle = (id: number) => {
        if (findSelected(id)) {
            onChange(value.filter((s) => s.skillId !== id))
        } else {
            onChange([...value, { skillId: id, level: "intermediate" }])
        }
    }

    const changeLevel = (id: number, level: SkillLevel) => {
        onChange(value.map((s) => (s.skillId === id ? { ...s, level } : s)))
    }

    // Regroupement par catégorie
    const groups = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        ;(acc[skill.category] ??= []).push(skill)
        return acc
    }, {})

    return (
        <div className="skill-picker">
            {Object.entries(groups).map(([category, items]) => (
                <fieldset key={category} className="skill-group">
                    <legend>{CATEGORY_LABELS[category as SkillCategory] ?? category}</legend>
                    {items.map((skill) => {
                        const selected = findSelected(skill.id)
                        return (
                            <div key={skill.id} className={`skill-row ${selected ? "skill-row-active" : ""}`}>
                                <label className="skill-check">
                                    <input
                                        type="checkbox"
                                        checked={!!selected}
                                        onChange={() => toggle(skill.id)}
                                    />
                                    <span>{skill.name}</span>
                                    {requiredSkillIds.includes(skill.id) && (
                                        <span className="skill-required">Requise</span>
                                    )}
                                </label>
                                {selected && (
                                    <select
                                        className="skill-level"
                                        value={selected.level}
                                        onChange={(e) => changeLevel(skill.id, e.target.value as SkillLevel)}
                                        aria-label={`Niveau en ${skill.name}`}
                                    >
                                        {Object.entries(LEVEL_LABELS).map(([val, label]) => (
                                            <option key={val} value={val}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )
                    })}
                </fieldset>
            ))}
        </div>
    )
}