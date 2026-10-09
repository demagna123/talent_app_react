export type EducationLevel = "bac" | "licence" | "master" | "doctorat" | "autre"

export type Candidate = {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string | null
    country: string | null
    city: string | null
    educationLevel: EducationLevel
    fieldOfStudy: string | null
    githubUrl: string | null
    portfolioUrl: string | null
    createdAt?: string
    updatedAt?: string

    // Ajoutés par la liste des candidats
    applicationsCount?: number
    bestScore?: number | null
}