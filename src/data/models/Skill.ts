export type SkillCategory = "frontend" | "backend" | "database" | "tools" | "other"

export type Skill = {
    id: number
    name: string
    category: SkillCategory
}