import type { Candidate } from "./Candidate"


import type { Program } from "./Program"
import type { Skill } from "./Skill"

export type ApplicationStatus = "new" | "under_review" | "shortlisted" | "rejected" | "accepted"
export type PriorityLevel = "priority" | "to_review" | "low"
export type Availability = "full_time" | "part_time" | "weekends"
export type SkillLevel = "beginner" | "intermediate" | "advanced"

// Compétence déclarée par le candidat (table de liaison ApplicationSkill)
export type ApplicationSkill = {
    level: SkillLevel
    skill: Skill
}

// Détail du score, enregistré par calculateScore
export type ScoreCriterion = { points: number; max: number }

export type ScoreBreakdown = {
    skills: ScoreCriterion & {
        matched: number[] // ids des compétences trouvées
        missingRequired: number[] // ids des compétences requises manquantes
    }
    experience: ScoreCriterion
    links: ScoreCriterion
    availability: ScoreCriterion
    motivation: ScoreCriterion
    cappedByRequiredSkills: boolean
}

export type Application = {
    id: number
    status: ApplicationStatus
    score: number | null // null tant que non calculé
    priorityLevel: PriorityLevel | null
    availability: Availability
    yearsOfExperience: number
    projectsCount: number
    createdAt: string

    // Présents dans la liste (la liste renvoie un candidat partiel)
    candidate?: Candidate
    program?: Pick<Program, "id" | "title" | "status" | "priorityThreshold" | "reviewThreshold">

    // Présents seulement dans le détail
    candidateId?: number
    programId?: number
    motivation?: string
    scoreBreakdown?: ScoreBreakdown | null
    applicationSkills?: ApplicationSkill[]
    rank?: number | null
    totalInProgram?: number
    missingRequiredSkills?: Pick<Skill, "id" | "name">[]
}