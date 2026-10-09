import type { Skill } from "./Skill"

export type ProgramStatus = "draft" | "open" | "closed"

// Compétence attendue par un programme (table de liaison ProgramSkill)
export type ProgramSkill = {
    weight: number // 1 à 5
    isRequired: boolean
    skill: Skill
}

export type Program = {
    id: number
    title: string
    description: string | null
    status: ProgramStatus
    startDate: string | null // "AAAA-MM-JJ"
    deadline: string | null // "AAAA-MM-JJ"
    maxSeats: number | null

    // Renvoyés seulement aux recruteurs (la liste publique ne les contient pas)
    priorityThreshold?: number
    reviewThreshold?: number
    applicationsCount?: number
    createdAt?: string
    updatedAt?: string

    programskills?: ProgramSkill[]
}