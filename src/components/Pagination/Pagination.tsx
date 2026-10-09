import Button from "../Button/Button"
import "./Pagination.css"

type PaginationProps = {
    page: number
    totalPages: number
    total?: number // nombre total de résultats (facultatif)
    onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
    // Rien à paginer : on n'affiche rien
    if (totalPages <= 1) return null

    return (
        <nav className="pagination" aria-label="Pagination">
            <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Précédent
            </Button>

            <span className="pagination-info">
                Page {page} sur {totalPages}
                {total !== undefined && ` · ${total} résultats`}
            </span>

            <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Suivant
            </Button>
        </nav>
    )
}