import { useState } from "react";
import Alert from "../../components/Alert/Alert";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Textarea from "../../components/Textarea/Textarea";
import PriorityBadge from "../../components/PriorityBadge/PriorityBadge";
import SkillPicker, { type SelectedSkill } from "../../components/SkillPicker/SkillPicker";
import type { Skill } from "../../data/models/Skill";
import ScoreBreakdown from './../../components/ScoreBreakdown/ScoreBreakdown';
import Pagination from "../../components/Pagination/Pagination";

export default function Home() {
const [message, setMessage] = useState(true)

const [selected, setSelected] = useState<SelectedSkill[]>([])

const skills: Skill[] = [
    { id: 1, name: "React", category: "frontend" },
    { id: 2, name: "TypeScript", category: "frontend" },
    { id: 3, name: "Node.js", category: "backend" },
    { id: 4, name: "MySQL", category: "database" },
]

const [page, setPage] = useState(1)


  return (
    <div>
      <Button children = " Soumettre" variant = {"danger"}  />

      <Input label="Prénom" required   />
<Input label="Email" type="email" required error="Adresse invalide" />
<Select
    label="Niveau d'études"
    placeholder="Choisir…"
    options={[
        { value: "bac", label: "Bac" },
        { value: "licence", label: "Licence" },
        { value: "master", label: "Master" },
    ]}
/>
<Textarea label="Motivation" />

<Card title="Informations du candidat">
    <Input label="Prénom" />
    <Input label="Nom" />
</Card>

<Card title="Candidatures" action={<Button variant="secondary">Exporter</Button>}>
    <p>Contenu…</p>
</Card>


<Alert type="success">Candidature envoyée avec succès.</Alert>
<Alert type="error">Vous avez déjà postulé à ce programme.</Alert>
{message && <Alert type="info" onClose={() => setMessage(false)}>Les candidatures ferment bientôt.</Alert>}


<PriorityBadge level="priority" />
<PriorityBadge level="to_review" />
<PriorityBadge level="low" />
<PriorityBadge level={null} />



<SkillPicker skills={skills} value={selected} onChange={setSelected} requiredSkillIds={[1, 3]} />
<pre>{JSON.stringify(selected, null, 2)}</pre>

<Card title="Détail du score">
    <ScoreBreakdown
        total={62}
        missingSkillNames={["Node.js"]}
        breakdown={{
            skills: { points: 21, max: 35, matched: [1, 2], missingRequired: [3] },
            experience: { points: 12, max: 20 },
            links: { points: 10, max: 15 },
            availability: { points: 9, max: 15 },
            motivation: { points: 10, max: 15 },
            cappedByRequiredSkills: true,
        }}
    />
</Card>


<Pagination page={page} totalPages={5} total={92} onPageChange={setPage} />
    </div>
  )
}
