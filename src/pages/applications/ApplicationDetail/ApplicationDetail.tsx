import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import axios from "axios"

import "./ApplicationDetail.css"
import type { Application, ApplicationStatus } from "../../../data/models/Application"
import Alert from "../../../components/Alert/Alert"
import Card from "../../../components/Card/Card"
import Select from "../../../components/Select/Select"
import Button from "../../../components/Button/Button"
import PriorityBadge from "../../../components/PriorityBadge/PriorityBadge"
import ScoreBreakdown from "../../../components/ScoreBreakdown/ScoreBreakdown"
import { applicationApi } from "../../../api/services/applications/applications"

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    new: "Nouvelle",
    under_review: "En examen",
    shortlisted: "Présélectionnée",
    rejected: "Refusée",
    accepted: "Acceptée",
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

const AVAILABILITY_LABELS = {
    full_time: "Temps plein",
    part_time: "Temps partiel",
    weekends: "Week-ends",
}

const LEVEL_LABELS = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
}

const EDUCATION_LABELS = {
    bac: "Bac",
    licence: "Licence",
    master: "Master",
    doctorat: "Doctorat",
    autre: "Autre",
}

const formatDate = (value: string) => new Date(value).toLocaleDateString("fr-FR")

export default function ApplicationDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [application, setApplication] = useState<Application | null>(null)
    const [newStatus, setNewStatus] = useState<ApplicationStatus>("new")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setLoading(true)
        applicationApi
            .getById(Number(id))
            .then((data) => {
                setApplication(data)
                setNewStatus(data.status)
                setError("")
            })
            .catch(() => setError("Cette candidature est introuvable."))
            .finally(() => setLoading(false))
    }, [id])

    const handleSaveStatus = async () => {
        if (!application) return
        setSaving(true)
        setSuccess(false)
        setError("")

        try {
            const updated = await applicationApi.updateStatus(application.id, newStatus)
            setApplication({ ...application, status: updated.status })
            setSuccess(true)
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.responseMessage ?? "Impossible de modifier le statut.")
            } else {
                setError("Le serveur est injoignable. Réessayez dans un instant.")
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <main className="detail-page">
                <p>Chargement…</p>
            </main>
        )
    }

    if (!application) {
        return (
            <main className="detail-page">
                <Alert type="error">{error || "Cette candidature est introuvable."}</Alert>
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                    Retour au classement
                </Button>
            </main>
        )
    }

    const candidate = application.candidate

    return (
        <main className="detail-page">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                ← Retour au classement
            </Button>

            <h1 className="detail-title">
                {candidate ? `${candidate.firstName} ${candidate.lastName}` : "Candidature"}
            </h1>

            {error && (
                <Alert type="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert type="success" onClose={() => setSuccess(false)}>
                    Le statut a bien été modifié.
                </Alert>
            )}

            <Card title="Résumé">
                <div className="detail-summary">
                    <div>
                        <span className="detail-label">Programme</span>
                        <strong>{application.program?.title ?? "—"}</strong>
                    </div>
                    <div>
                        <span className="detail-label">Score</span>
                        <strong className="detail-score">{application.score ?? "—"}</strong>
                    </div>
                    <div>
                        <span className="detail-label">Priorité</span>
                        <PriorityBadge level={application.priorityLevel} />
                    </div>
                    <div>
                        <span className="detail-label">Rang</span>
                        <strong>
                            {application.rank ? `${application.rank} / ${application.totalInProgram}` : "—"}
                        </strong>
                    </div>
                </div>
            </Card>

            <Card title="Statut de la candidature">
                <div className="detail-status">
                    <Select
                        label="Statut"
                        options={STATUS_OPTIONS}
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    />
                    <Button
                        loading={saving}
                        disabled={newStatus === application.status}
                        onClick={handleSaveStatus}
                    >
                        Enregistrer
                    </Button>
                </div>
            </Card>

            {application.scoreBreakdown && (
                <Card title="Détail du score">
                    <ScoreBreakdown
                        breakdown={application.scoreBreakdown}
                        total={application.score}
                        missingSkillNames={application.missingRequiredSkills?.map((s) => s.name)}
                    />
                </Card>
            )}

            {candidate && (
                <Card title="Informations du candidat">
                    <dl className="detail-info">
                        <div><dt>Email</dt><dd>{candidate.email}</dd></div>
                        <div><dt>Téléphone</dt><dd>{candidate.phone ?? "—"}</dd></div>
                        <div>
                            <dt>Localisation</dt>
                            <dd>{[candidate.city, candidate.country].filter(Boolean).join(", ") || "—"}</dd>
                        </div>
                        <div>
                            <dt>Études</dt>
                            <dd>
                                {EDUCATION_LABELS[candidate.educationLevel]}
                                {candidate.fieldOfStudy && ` · ${candidate.fieldOfStudy}`}
                            </dd>
                        </div>
                        <div>
                            <dt>GitHub</dt>
                            <dd>
                                {candidate.githubUrl ? (
                                    <a href={candidate.githubUrl} target="_blank" rel="noreferrer">{candidate.githubUrl}</a>
                                ) : "—"}
                            </dd>
                        </div>
                        <div>
                            <dt>Portfolio</dt>
                            <dd>
                                {candidate.portfolioUrl ? (
                                    <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer">{candidate.portfolioUrl}</a>
                                ) : "—"}
                            </dd>
                        </div>
                    </dl>
                </Card>
            )}

            <Card title="Profil">
                <dl className="detail-info">
                    <div><dt>Disponibilité</dt><dd>{AVAILABILITY_LABELS[application.availability]}</dd></div>
                    <div><dt>Expérience</dt><dd>{application.yearsOfExperience} an(s)</dd></div>
                    <div><dt>Projets réalisés</dt><dd>{application.projectsCount}</dd></div>
                    <div><dt>Candidature du</dt><dd>{formatDate(application.createdAt)}</dd></div>
                </dl>
            </Card>

            {application.applicationSkills && application.applicationSkills.length > 0 && (
                <Card title="Compétences déclarées">
                    <ul className="detail-skills">
                        {application.applicationSkills.map((as) => (
                            <li key={as.skill.id} className="detail-skill">
                                {as.skill.name} · {LEVEL_LABELS[as.level]}
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {application.motivation && (
                <Card title="Motivation">
                    <p className="detail-motivation">{application.motivation}</p>
                </Card>
            )}
        </main>
    )
}