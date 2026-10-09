import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import "./ApplicationList.css"
import type { Application, ApplicationStatus, PriorityLevel } from "../../../data/models/Application"
import type { Program } from "../../../data/models/Program"
import { programApi } from "../../../api/services/programs/program"
import Alert from "../../../components/Alert/Alert"
import Card from "../../../components/Card/Card"
import Input from "../../../components/Input/Input"
import Select from "../../../components/Select/Select"
import Button from "../../../components/Button/Button"
import PriorityBadge from "../../../components/PriorityBadge/PriorityBadge"
import Pagination from "../../../components/Pagination/Pagination"
import type { Pagination as PaginationType } from "../../../responses/responses"
import { applicationApi, type ApplicationFilters } from "../../../api/services/applications/applications"
import { useNavigate } from "react-router"

const LIMIT = 10

const STATUS_LABELS: Record<ApplicationStatus, string> = {
    new: "Nouvelle",
    under_review: "En examen",
    shortlisted: "Présélectionnée",
    rejected: "Refusée",
    accepted: "Acceptée",
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

const PRIORITY_OPTIONS = [
    { value: "priority", label: "Prioritaire" },
    { value: "to_review", label: "À examiner" },
    { value: "low", label: "Faible" },
]

const SORT_OPTIONS = [
    { value: "score", label: "Score" },
    { value: "createdAt", label: "Date de candidature" },
    { value: "yearsOfExperience", label: "Années d'expérience" },
    { value: "projectsCount", label: "Nombre de projets" },
]

const formatDate = (value: string) => new Date(value).toLocaleDateString("fr-FR")

// Valeurs des filtres telles que saisies (chaînes vides = pas de filtre)
type FilterForm = {
    programId: string
    priorityLevel: string
    status: string
    search: string
    sortBy: string
}

const INITIAL_FILTERS: FilterForm = {
    programId: "",
    priorityLevel: "",
    status: "",
    search: "",
    sortBy: "score",
}

export default function ApplicationList() {
    const [applications, setApplications] = useState<Application[]>([])
    const [pagination, setPagination] = useState<PaginationType | null>(null)
    const [programs, setPrograms] = useState<Program[]>([])
    const [page, setPage] = useState(1)
    const [draft, setDraft] = useState<FilterForm>(INITIAL_FILTERS) // ce que l'utilisateur saisit
    const [applied, setApplied] = useState<FilterForm>(INITIAL_FILTERS) // ce qui est envoyé à l'API
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    // Liste des programmes pour le filtre
    useEffect(() => {
        programApi
            .getAll({ limit: 100 })
            .then((res) => setPrograms(res.data))
            .catch(() => setError("Impossible de charger les programmes."))
    }, [])

    // Liste des candidatures : se recharge quand la page ou les filtres appliqués changent
    useEffect(() => {
        setLoading(true)

        const filters: ApplicationFilters = {
            page,
            limit: LIMIT,
            programId: applied.programId ? Number(applied.programId) : undefined,
            priorityLevel: (applied.priorityLevel || undefined) as PriorityLevel | undefined,
            status: (applied.status || undefined) as ApplicationStatus | undefined,
            search: applied.search.trim() || undefined,
            sortBy: applied.sortBy as ApplicationFilters["sortBy"],
            order: "DESC",
        }

        applicationApi
            .getAll(filters)
            .then((res) => {
                setApplications(res.data)
                setPagination(res.pagination ?? null)
                setError("")
            })
            .catch(() => setError("Impossible de charger les candidatures."))
            .finally(() => setLoading(false))
    }, [page, applied])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setDraft((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setPage(1) // un nouveau filtre repart de la première page
        setApplied(draft)
    }

    const handleReset = () => {
        setPage(1)
        setDraft(INITIAL_FILTERS)
        setApplied(INITIAL_FILTERS)
    }

    return (
        <main className="dashboard-page">
            <h1>Classement des candidatures</h1>

            <Card title="Filtres">
                <form onSubmit={handleSubmit}>
                    <div className="dashboard-filters">
                        <Select
                            label="Programme"
                            name="programId"
                            placeholder="Tous les programmes"
                            options={programs.map((p) => ({ value: p.id, label: p.title }))}
                            value={draft.programId}
                            onChange={handleChange}
                        />
                        <Select
                            label="Priorité"
                            name="priorityLevel"
                            placeholder="Toutes"
                            options={PRIORITY_OPTIONS}
                            value={draft.priorityLevel}
                            onChange={handleChange}
                        />
                        <Select
                            label="Statut"
                            name="status"
                            placeholder="Tous"
                            options={STATUS_OPTIONS}
                            value={draft.status}
                            onChange={handleChange}
                        />
                        <Select
                            label="Trier par"
                            name="sortBy"
                            options={SORT_OPTIONS}
                            value={draft.sortBy}
                            onChange={handleChange}
                        />
                        <Input
                            label="Recherche"
                            name="search"
                            placeholder="Nom ou email"
                            value={draft.search}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="dashboard-filter-actions">
                        <Button type="submit">Appliquer</Button>
                        <Button variant="secondary" onClick={handleReset}>
                            Réinitialiser
                        </Button>
                    </div>
                </form>
            </Card>

            {error && <Alert type="error">{error}</Alert>}

            <Card>
                {loading && <p>Chargement…</p>}
                {!loading && !error && applications.length === 0 && <p>Aucune candidature trouvée.</p>}

                {applications.length > 0 && (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Candidat</th>
                                    <th>Programme</th>
                                    <th>Score</th>
                                    <th>Priorité</th>
                                    <th>Statut</th>
                                    <th>Exp.</th>
                                    <th>Projets</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app, index) => (
                                   <tr key={app.id} className="dashboard-row" onClick={() => navigate(`/applications/${app.id}`)}>
                                        <td>{(page - 1) * LIMIT + index + 1}</td>
                                        <td>
                                            <div className="dashboard-candidate">
                                                {app.candidate
                                                    ? `${app.candidate.firstName} ${app.candidate.lastName}`
                                                    : "—"}
                                            </div>
                                            <div className="dashboard-email">{app.candidate?.email}</div>
                                        </td>
                                        <td>{app.program?.title ?? "—"}</td>
                                        <td className="dashboard-score">{app.score ?? "—"}</td>
                                        <td>
                                            <PriorityBadge level={app.priorityLevel} />
                                        </td>
                                        <td>{STATUS_LABELS[app.status]}</td>
                                        <td>{app.yearsOfExperience} an(s)</td>
                                        <td>{app.projectsCount}</td>
                                        <td>{formatDate(app.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {pagination && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        total={pagination.total}
                        onPageChange={setPage}
                    />
                )}
            </Card>
        </main>
    )
}