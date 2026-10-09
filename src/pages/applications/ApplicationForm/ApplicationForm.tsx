import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"

import "./ApplicationForm.css"
import type { Skill } from "../../../data/models/Skill"
import type { Program } from "../../../data/models/Program"
import type { Availability } from "../../../data/models/Application"
import type { EducationLevel } from "../../../data/models/Candidate"
import type { ApplicationPayload } from "../../../data/models/ApplicationPayload"
import type { SelectedSkill } from "../../../components/SkillPicker/SkillPicker"
import { skillApi } from "../../../api/services/skills/skill"
import { programApi } from "../../../api/services/programs/program"
import Alert from "../../../components/Alert/Alert"
import Card from "../../../components/Card/Card"
import Input from "../../../components/Input/Input"
import Textarea from "../../../components/Textarea/Textarea"
import Select from "../../../components/Select/Select"
import SkillPicker from "../../../components/SkillPicker/SkillPicker"
import Button from "../../../components/Button/Button"
import { applicationApi } from "../../../api/services/applications/applications"

type FormState = {
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    city: string
    educationLevel: EducationLevel
    fieldOfStudy: string
    githubUrl: string
    portfolioUrl: string
    availability: Availability
    yearsOfExperience: string
    projectsCount: string
    motivation: string
}

const INITIAL: FormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    educationLevel: "licence",
    fieldOfStudy: "",
    githubUrl: "",
    portfolioUrl: "",
    availability: "full_time",
    yearsOfExperience: "0",
    projectsCount: "0",
    motivation: "",
}

const EDUCATION_OPTIONS = [
    { value: "bac", label: "Bac" },
    { value: "licence", label: "Licence" },
    { value: "master", label: "Master" },
    { value: "doctorat", label: "Doctorat" },
    { value: "autre", label: "Autre" },
]

const AVAILABILITY_OPTIONS = [
    { value: "full_time", label: "Temps plein" },
    { value: "part_time", label: "Temps partiel" },
    { value: "weekends", label: "Week-ends" },
]

const optional = (value: string) => (value.trim() === "" ? undefined : value.trim())

export default function ApplicationForm() {
    const { programId } = useParams<{ programId: string }>()
    const navigate = useNavigate()

    const [program, setProgram] = useState<Program | null>(null)
    const [programLoading, setProgramLoading] = useState(true)
    const [form, setForm] = useState<FormState>(INITIAL)
    const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([])
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    // Charge les compétences et retrouve le programme demandé dans l'URL
    useEffect(() => {
        setProgramLoading(true)
        Promise.all([skillApi.getAll(), programApi.getAll({ limit: 100 })])
            .then(([skillsList, programsRes]) => {
                setSkills(skillsList)
                const found = programsRes.data.find((p) => String(p.id) === programId)
                setProgram(found ?? null)
            })
            .catch(() => setErrorMessage("Impossible de charger les données du formulaire."))
            .finally(() => setProgramLoading(false))
    }, [programId])

    const requiredSkillIds =
        program?.programskills?.filter((ps) => ps.isRequired).map((ps) => ps.skill.id) ?? []

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!program) return

        setLoading(true)
        setSuccess(false)
        setErrorMessage("")
        setFieldErrors({})

        const payload: ApplicationPayload = {
            programId: program.id,
            candidate: {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: optional(form.phone),
                country: optional(form.country),
                city: optional(form.city),
                educationLevel: form.educationLevel,
                fieldOfStudy: optional(form.fieldOfStudy),
                githubUrl: optional(form.githubUrl),
                portfolioUrl: optional(form.portfolioUrl),
            },
            motivation: form.motivation,
            availability: form.availability,
            yearsOfExperience: Number(form.yearsOfExperience),
            projectsCount: Number(form.projectsCount),
            skills: selectedSkills,
        }

        try {
            await applicationApi.create(payload)
            setSuccess(true)
            setForm(INITIAL)
            setSelectedSkills([])
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data
                setErrorMessage(body?.responseMessage ?? "Une erreur est survenue.")

                // Erreurs par champ : data = [{ field, message }]
                if (Array.isArray(body?.data)) {
                    const byField: Record<string, string> = {}
                    for (const item of body.data) {
                        if (item.field) byField[item.field] = item.message
                    }
                    setFieldErrors(byField)
                }
            } else {
                setErrorMessage("Le serveur est injoignable. Réessayez dans un instant.")
            }
            window.scrollTo({ top: 0, behavior: "smooth" })
        } finally {
            setLoading(false)
        }
    }

    if (programLoading) {
        return (
            <main className="form-page">
                <p>Chargement…</p>
            </main>
        )
    }

    // Programme absent de la liste : inexistant, fermé ou expiré
    if (!program) {
        return (
            <main className="form-page">
                <Alert type="error">
                    {errorMessage || "Ce programme est introuvable ou n'accepte plus de candidatures."}
                </Alert>
                <Button variant="secondary" onClick={() => navigate("/programs")}>
                    Retour aux programmes
                </Button>
            </main>
        )
    }

    return (
        <main className="form-page">
            <h1>Postuler : {program.title}</h1>

            {success && (
                <Alert type="success" onClose={() => setSuccess(false)}>
                    Votre candidature a bien été envoyée. Merci !
                </Alert>
            )}
            {errorMessage && (
                <Alert type="error" onClose={() => setErrorMessage("")}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Card title="Vos informations">
                    <div className="form-grid">
                        <Input label="Prénom" name="firstName" required value={form.firstName} onChange={handleChange} error={fieldErrors.firstName} />
                        <Input label="Nom" name="lastName" required value={form.lastName} onChange={handleChange} error={fieldErrors.lastName} />
                        <Input label="Email" name="email" type="email" required value={form.email} onChange={handleChange} error={fieldErrors.email} />
                        <Input label="Téléphone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={fieldErrors.phone} />
                        <Input label="Pays" name="country" value={form.country} onChange={handleChange} error={fieldErrors.country} />
                        <Input label="Ville" name="city" value={form.city} onChange={handleChange} error={fieldErrors.city} />
                        <Select label="Niveau d'études" name="educationLevel" options={EDUCATION_OPTIONS} value={form.educationLevel} onChange={handleChange} error={fieldErrors.educationLevel} />
                        <Input label="Domaine d'études" name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} error={fieldErrors.fieldOfStudy} />
                        <Input label="Lien GitHub" name="githubUrl" type="url" placeholder="https://github.com/..." value={form.githubUrl} onChange={handleChange} error={fieldErrors.githubUrl} />
                        <Input label="Lien portfolio" name="portfolioUrl" type="url" placeholder="https://..." value={form.portfolioUrl} onChange={handleChange} error={fieldErrors.portfolioUrl} />
                    </div>
                </Card>

                <Card title="Votre profil">
                    <div className="form-grid">
                        <Select label="Disponibilité" name="availability" options={AVAILABILITY_OPTIONS} value={form.availability} onChange={handleChange} error={fieldErrors.availability} />
                        <Input label="Années d'expérience" name="yearsOfExperience" type="number" min={0} value={form.yearsOfExperience} onChange={handleChange} error={fieldErrors.yearsOfExperience} />
                        <Input label="Nombre de projets réalisés" name="projectsCount" type="number" min={0} value={form.projectsCount} onChange={handleChange} error={fieldErrors.projectsCount} />
                    </div>
                </Card>

                <Card title="Vos compétences">
                    <SkillPicker
                        skills={skills}
                        value={selectedSkills}
                        onChange={setSelectedSkills}
                        requiredSkillIds={requiredSkillIds}
                    />
                </Card>

                <Card title="Motivation">
                    <Textarea
                        label="Pourquoi ce programme ?"
                        name="motivation"
                        rows={6}
                        value={form.motivation}
                        onChange={handleChange}
                        error={fieldErrors.motivation}
                    />
                </Card>

                <Button type="submit" loading={loading}>
                    Envoyer ma candidature
                </Button>
            </form>
        </main>
    )
}