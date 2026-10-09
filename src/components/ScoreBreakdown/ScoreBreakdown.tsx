import type { ScoreBreakdown as ScoreBreakdownType, ScoreCriterion } from "../../data/models/Application"
import "./ScoreBreakdown.css"

type ScoreBreakdownProps = {
    breakdown: ScoreBreakdownType | string // certaines bases renvoient le JSON sous forme de texte
    total: number | null
    missingSkillNames?: string[]
}

type CriterionKey = "skills" | "experience" | "links" | "availability" | "motivation"

const CRITERIA: { key: CriterionKey; label: string }[] = [
    { key: "skills", label: "Compétences" },
    { key: "experience", label: "Expérience" },
    { key: "links", label: "Liens (GitHub, portfolio)" },
    { key: "availability", label: "Disponibilité" },
    { key: "motivation", label: "Motivation" },
]

// Accepte un objet ou une chaîne JSON ; renvoie null si le contenu est inutilisable
function normalize(breakdown: ScoreBreakdownType | string): ScoreBreakdownType | null {
    if (typeof breakdown !== "string") return breakdown
    try {
        return JSON.parse(breakdown) as ScoreBreakdownType
    } catch {
        return null
    }
}

function Bar({ label, criterion }: { label: string; criterion: ScoreCriterion }) {
    const percent = criterion.max > 0 ? Math.round((criterion.points / criterion.max) * 100) : 0
    return (
        <div className="score-row">
            <div className="score-row-head">
                <span>{label}</span>
                <span className="score-row-points">
                    {criterion.points} / {criterion.max}
                </span>
            </div>
            <div
                className="score-bar"
                role="progressbar"
                aria-label={label}
                aria-valuenow={criterion.points}
                aria-valuemin={0}
                aria-valuemax={criterion.max}
            >
                <div className="score-bar-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}

export default function ScoreBreakdown({ breakdown, total, missingSkillNames = [] }: ScoreBreakdownProps) {
    const data = normalize(breakdown)

    if (!data) {
        return <p>Le détail du score n'est pas disponible.</p>
    }

    return (
        <div className="score-breakdown">
            {total !== null && (
                <p className="score-total">
                    Score total : <strong>{total}</strong> / 100
                </p>
            )}

            {CRITERIA.map(({ key, label }) => {
                const criterion = data[key]
                // Un critère absent est ignoré au lieu de faire planter la page
                if (!criterion) return null
                return <Bar key={key} label={label} criterion={criterion} />
            })}

            {data.cappedByRequiredSkills && (
                <p className="score-warning">
                    Score plafonné : il manque des compétences requises
                    {missingSkillNames.length > 0 && ` (${missingSkillNames.join(", ")})`}.
                </p>
            )}
        </div>
    )
}