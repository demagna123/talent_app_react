import type { PriorityLevel } from "../../data/models/Application"
import "./PriorityBadge.css"

type PriorityBadgeProps = {
    level: PriorityLevel | null // null tant que le score n'est pas calculé
}

const LABELS: Record<PriorityLevel, string> = {
    priority: "Prioritaire",
    to_review: "À examiner",
    low: "Faible",
}

export default function PriorityBadge({ level }: PriorityBadgeProps) {
    if (!level) {
        return <span className="priority-badge priority-none">Non évalué</span>
    }
    return <span className={`priority-badge priority-${level}`}>{LABELS[level]}</span>
}