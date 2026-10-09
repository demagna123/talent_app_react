import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import axios from "axios"

import "./ProgramForm.css"
import type { ProgramStatus } from "../../../data/models/Program"
import type { Skill } from "../../../data/models/Skill"
import type { ProgramSkillSelection } from "../../../components/ProgramSkillPicker/ProgramSkillPicker"
import { skillApi } from "../../../api/services/skills/skill"
import { programApi, type ProgramPayload } from "../../../api/services/programs/program"
import Alert from "../../../components/Alert/Alert"
import Card from "../../../components/Card/Card"
import Input from "../../../components/Input/Input"
import Textarea from "../../../components/Textarea/Textarea"
import Select from "../../../components/Select/Select"
import ProgramSkillPicker from "../../../components/ProgramSkillPicker/ProgramSkillPicker"
import Button from "../../../components/Button/Button"

type FormState = {
    title: string
    description: string
    status: ProgramStatus
    startDate: string
    deadline: string
    maxSeats: string
    priorityThreshold: string
    reviewThreshold: string
}

const INITIAL: FormState = {
    title: "",
    description: "",
    status: "open",
    startDate: "",
    deadline: "",
    maxSeats: "",
    priorityThreshold: "70",
    reviewThreshold: "40",
}

const STATUS_OPTIONS = [
    { value: "draft", label: "Brouillon" },
    { value: "open", label: "Ouvert" },
    { value: "closed", label: "Fermé" },
]

const optional = (value: string) => (value.trim() === "" ? undefined : value.trim())

export default function ProgramForm() {
    const [form, setForm] = useState<FormState>(INITIAL)
    const [selectedSkills, setSelectedSkills] = useState<ProgramSkillSelection[]>([])
    const [skills, setSkills] = useState<Skill[]>([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        skillApi.getAll().then(setSkills).catch(() => setErrorMessage("Impossible de charger les compétences."))
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)
        setErrorMessage("")
        setFieldErrors({})

        const payload: ProgramPayload = {
            title: form.title.trim(),
            description: optional(form.description),
            status: form.status,
            startDate: optional(form.startDate),
            deadline: optional(form.deadline),
            maxSeats: form.maxSeats.trim() === "" ? undefined : Number(form.maxSeats),
            priorityThreshold: Number(form.priorityThreshold),
            reviewThreshold: Number(form.reviewThreshold),
            skills: selectedSkills,
        }

        try {
            await programApi.create(payload)
            setSuccess(true)
            setForm(INITIAL)
            setSelectedSkills([])
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data
                setErrorMessage(body?.responseMessage ?? "Une erreur est survenue.")

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

    return (
        <main className="program-form-page">
            <h1>Créer un programme</h1>

            {success && (
                <Alert type="success" onClose={() => setSuccess(false)}>
                    Le programme a bien été créé.
                </Alert>
            )}
            {errorMessage && (
                <Alert type="error" onClose={() => setErrorMessage("")}>
                    {errorMessage}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Card title="Informations générales">
                    <Input label="Titre" name="title" required value={form.title} onChange={handleChange} error={fieldErrors.title} />
                    <Textarea label="Description" name="description" value={form.description} onChange={handleChange} error={fieldErrors.description} />
                    <div className="program-form-grid">
                        <Select label="Statut" name="status" options={STATUS_OPTIONS} value={form.status} onChange={handleChange} error={fieldErrors.status} />
                        <Input label="Nombre de places" name="maxSeats" type="number" min={1} value={form.maxSeats} onChange={handleChange} error={fieldErrors.maxSeats} />
                        <Input label="Date limite de candidature" name="deadline" type="date" value={form.deadline} onChange={handleChange} error={fieldErrors.deadline} />
                        <Input label="Date de début" name="startDate" type="date" value={form.startDate} onChange={handleChange} error={fieldErrors.startDate} />
                    </div>
                </Card>

                <Card title="Seuils de priorité">
                    <p className="program-form-hint">
                        À partir de quel score un profil est « prioritaire » ou « à examiner ». Le seuil à examiner doit rester inférieur au seuil prioritaire.
                    </p>
                    <div className="program-form-grid">
                        <Input label="Seuil prioritaire (0-100)" name="priorityThreshold" type="number" min={0} max={100} value={form.priorityThreshold} onChange={handleChange} error={fieldErrors.priorityThreshold} />
                        <Input label="Seuil à examiner (0-100)" name="reviewThreshold" type="number" min={0} max={100} value={form.reviewThreshold} onChange={handleChange} error={fieldErrors.reviewThreshold} />
                    </div>
                </Card>

                <Card title="Compétences attendues">
                    <p className="program-form-hint">
                        Le poids (1 à 5) mesure l'importance de la compétence dans le score. Une compétence « requise » plafonne le score du candidat qui ne l'a pas.
                    </p>
                    {fieldErrors.skills && <p className="field-error">{fieldErrors.skills}</p>}
                    <ProgramSkillPicker skills={skills} value={selectedSkills} onChange={setSelectedSkills} />
                </Card>

                <Button type="submit" loading={loading}>
                    Créer le programme
                </Button>
            </form>
        </main>
    )
}