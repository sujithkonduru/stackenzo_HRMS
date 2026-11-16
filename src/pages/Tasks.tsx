import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { taskApi } from '../api'
import { errMsg } from '../api/axiosInstance'
import { Card, Badge, Btn, Modal, Field, inp, MultiPick, Empty, Progress, Spinner, fmt, fmtDT, isOverdue, PageHead } from '../components/ui'
export function TaskDetail({ t, onClose }: any) {
  const D = (v: any) => v ?? '—'
  return <Modal title={t.title} onClose={onClose} wide><div className="mb-3 flex gap-2"><Badge v={t.priority} /><Badge v={t.assignment_status || t.task_status} />{isOverdue(t) && <Badge v="OVERDUE" />}</div>
    <p className="mb-4 whitespace-pre-wrap text-sm">{t.description}</p><Progress value={t.progress_percentage} />
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">{[['Assigned to', `${t.employee_name} (${D(t.employee_job_title)})`], ['Assigned by', t.assigned_by_name], ['Start', fmt(t.start_at)], ['Deadline', fmt(t.deadline_at)], ['Acknowledge by', fmt(t.acknowledgment_deadline)], ['Acknowledged', fmtDT(t.acknowledged_at)], ['Started', fmtDT(t.started_at)], ['Completed', fmtDT(t.completed_at)], ['Update message', t.update_message], ['Pending reason', t.pending_reason], ['Last update', fmtDT(t.last_update_at)], ['Reminders', t.my_reminders?.length ? t.my_reminders.length : 'None']].map(([k, v]) => <div key={k as string}><dt className="text-slate-500">{k}</dt><dd className="font-medium">{D(v)}</dd></div>)}</dl>
    <div className="mt-5 flex flex-wrap gap-2">{['Acknowledge', 'Update progress', 'Mark complete'].map(a => <Btn key={a} variant="ghost" disabled title="Pending backend integration: endpoint not documented">{a}</Btn>)}</div>
    <p className="mt-2 text-xs text-slate-400">Task update actions are pending backend integration (not in the API document).</p></Modal>
}
function CreateTask({ onClose }: any) {
  const { dash, refresh } = useAuth(); const emps = dash?.employees?.list || []
  const [f, setF] = useState<any>({ title: '', description: '', priority: 'MEDIUM', start_at: '', deadline_at: '', acknowledgment_deadline: '' }); const [as, setAs] = useState<string[]>([]); const [busy, setBusy] = useState(false)
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: any) => {
    e.preventDefault()
    if (!f.title || !f.start_at || !f.deadline_at || !f.acknowledgment_deadline || !as.length) return toast.error('Fill all required fields and pick an assignee')
    if (f.deadline_at < f.start_at) return toast.error('Deadline must be after start date')
    setBusy(true)
    try { const r = await taskApi.createBulk([{ ...f, assignees: as }]); toast.success(r.message || 'Task created'); await refresh(); onClose() } catch (x) { toast.error(errMsg(x)) } finally { setBusy(false) }
  }
  return <Modal title="Create task" onClose={onClose} wide><form onSubmit={submit} className="space-y-3">
    <Field label="Title *"><input className={inp} value={f.title} onChange={set('title')} /></Field>
    <Field label="Description"><textarea rows={3} className={inp} value={f.description} onChange={set('description')} /></Field>
    <div className="grid gap-3 sm:grid-cols-4"><Field label="Priority"><select className={inp} value={f.priority} onChange={set('priority')}><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></Field>
      <Field label="Start *"><input type="date" className={inp} value={f.start_at} onChange={set('start_at')} /></Field><Field label="Deadline *"><input type="date" className={inp} value={f.deadline_at} onChange={set('deadline_at')} /></Field><Field label="Acknowledge by *"><input type="date" className={inp} value={f.acknowledgment_deadline} onChange={set('acknowledgment_deadline')} /></Field></div>
    <Field label="Assignees *"><MultiPick options={emps} value={as} onChange={setAs} /></Field><Btn type="submit" loading={busy} className="w-full">Assign task</Btn></form></Modal>
}
const TABS = ['ALL', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE']
function Freestyle() {
  const [page, setPage] = useState(1); const [d, setD] = useState<any>(null); const [err, setErr] = useState(''); const [sel, setSel] = useState<any>(null)
  useEffect(() => { setD(null); taskApi.all({ page, limit: 20 }).then(setD).catch(e => setErr(errMsg(e))) }, [page])
  if (err) return <Empty text={err} />; if (!d) return <Spinner />
  const p = d.pagination || {}, s = d.summary || {}
  return <><div className="mb-4 grid grid-cols-3 gap-2 md:grid-cols-6">{Object.entries(s).map(([k, v]) => <Card key={k} className="p-3"><div className="text-xs capitalize text-slate-500">{k.replace('_', ' ')}</div><div className="text-xl font-bold">{v as any}</div></Card>)}</div>
    {!d.tasks?.length ? <Empty text="No freestyle tasks returned." /> : d.tasks.map((t: any) => <Card key={t.id} className="mb-2 p-4"><div className="flex justify-between gap-2"><b>{t.title}</b><Badge v={t.status} /></div><p className="line-clamp-2 text-sm text-slate-500">{t.description}</p></Card>)}
    <div className="mt-4 flex items-center justify-between text-sm"><span>Page {p.current_page} of {p.total_pages || 1} · {p.total_records} records</span><div className="flex gap-2"><Btn variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn><Btn variant="ghost" disabled={page >= (p.total_pages || 1)} onClick={() => setPage(page + 1)}>Next</Btn></div></div>{sel && null}</>
}
export default function Tasks() {
  const { dash, isAdmin } = useAuth(); const [tab, setTab] = useState('ALL'); const [q, setQ] = useState(''); const [pr, setPr] = useState(''); const [sel, setSel] = useState<any>(null); const [show, setShow] = useState(false); const [fs, setFs] = useState(false)
  const tasks = (dash?.tasks || []).filter((t: any) => (tab === 'ALL' || (tab === 'OVERDUE' ? isOverdue(t) : t.assignment_status === tab)) && (!pr || t.priority === pr) && (!q || (t.title + t.description + t.employee_name).toLowerCase().includes(q.toLowerCase())))
  return <><PageHead title="Tasks" action={<div className="flex gap-2">{isAdmin && <Btn variant="ghost" onClick={() => setFs(!fs)}>{fs ? 'My dashboard tasks' : 'All freestyle tasks'}</Btn>}{isAdmin && <Btn onClick={() => setShow(true)}><Plus size={16} />New task</Btn>}</div>} />
    {fs ? <Freestyle /> : <><div className="mb-3 flex flex-wrap gap-1">{TABS.map(x => <button key={x} onClick={() => setTab(x)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === x ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{x.replace('_', ' ')}</button>)}</div>
      <div className="mb-4 grid gap-2 sm:grid-cols-3"><input className={inp} placeholder="Search tasks" value={q} onChange={e => setQ(e.target.value)} /><select className={inp} value={pr} onChange={e => setPr(e.target.value)}><option value="">All priorities</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></div>
      {!tasks.length ? <Empty text="No tasks match." /> : <Card className="overflow-x-auto"><table className="w-full min-w-[800px] text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr>{['Task', 'Assignee', 'Assigned by', 'Priority', 'Status', 'Deadline', 'Progress'].map(h => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{tasks.map((t: any) => <tr key={t.assignment_id} onClick={() => setSel(t)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"><td className="max-w-xs px-3 py-2"><div className="font-medium">{t.title}</div><div className="truncate text-xs text-slate-500">{t.description}</div></td><td>{t.employee_name}</td><td>{t.assigned_by_name}</td><td><Badge v={t.priority} /></td><td><Badge v={t.assignment_status} /> {isOverdue(t) && <Badge v="OVERDUE" />}</td><td>{fmt(t.deadline_at)}</td><td className="w-28 pr-3"><Progress value={t.progress_percentage} /></td></tr>)}</tbody></table></Card>}</>}
    {sel && <TaskDetail t={sel} onClose={() => setSel(null)} />}{show && <CreateTask onClose={() => setShow(false)} />}</>
}
