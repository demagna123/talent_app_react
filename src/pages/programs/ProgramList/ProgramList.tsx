import { useEffect, useState } from "react"
import "./ProgramList.css"
import type { Program, ProgramStatus } from "../../../data/models/Program"
import { programApi } from "../../../api/services/programs/program"
import Alert from "../../../components/Alert/Alert"
import Card from "../../../components/Card/Card"
import Pagination from "../../../components/Pagination/Pagination"
import type { Pagination as PaginationType } from "../../../responses/responses"
import { useNavigate } from "react-router"
import Button from "../../../components/Button/Button"

const STATUS_LABELS: Record<ProgramStatus, string> = {
    draft: "Brouillon",
    open: "Ouvert",
    closed: "Fermé",
}

// "2026-10-12" -> "12/10/2026" (UTC pour éviter un décalage d'un jour)
const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString("fr-FR", { timeZone: "UTC" }) : "—"

export default function ProgramList() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [pagination, setPagination] = useState<PaginationType | null>(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate() 

    useEffect(() => {
        setLoading(true)
        programApi
            .getAll({ page, limit: 6 })
            .then((res) => {
                setPrograms(res.data)
                setPagination(res.pagination ?? null)
                setError("")
            })
            .catch(() => setError("Impossible de charger les programmes."))
            .finally(() => setLoading(false))
    }, [page])

    return (
        <main className="programs-page">
            <h1>Programmes</h1>

            {error && <Alert type="error">{error}</Alert>}
            {loading && <p>Chargement…</p>}
            {!loading && !error && programs.length === 0 && <p>Aucun programme disponible pour le moment.</p>}

            {programs.map((program) => (
                <Card key={program.id} title={program.title}>
                    <span className={`program-status program-status-${program.status}`}>
                        {STATUS_LABELS[program.status]}
                    </span>

                    {program.description && <p className="program-description">{program.description}</p>}

                    <dl className="program-meta">
                        <div>
                            <dt>Date limite</dt>
                            <dd>{formatDate(program.deadline)}</dd>
                        </div>
                        <div>
                            <dt>Début</dt>
                            <dd>{formatDate(program.startDate)}</dd>
                        </div>
                        <div>
                            <dt>Places</dt>
                            <dd>{program.maxSeats ?? "—"}</dd>
                        </div>
                        {program.applicationsCount !== undefined && (
                            <div>
                                <dt>Candidatures</dt>
                                <dd>{program.applicationsCount}</dd>
                            </div>
                        )}
                    </dl>

                    {program.programskills && program.programskills.length > 0 && (
                        <ul className="program-skills">
                            {program.programskills.map((ps) => (
                                <li
                                    key={ps.skill.id}
                                    className={ps.isRequired ? "program-skill program-skill-required" : "program-skill"}
                                >
                                    {ps.skill.name}
                                    {ps.isRequired && " · requise"}
                                </li>
                            ))}
                        </ul>
                    )}

                    {program.status === "open" && (
    <div className="program-actions">
        <Button onClick={() => navigate(`/programs/${program.id}/apply`)}>Postuler</Button>
    </div>
)}
                </Card>
            ))}

            {pagination && (
                <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    onPageChange={setPage}
                />
            )}
        </main>
    )
}