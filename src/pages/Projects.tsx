import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { projectApi } from '../api'
import { errMsg } from '../api/axiosInstance'
import { Card, Badge, Btn, Modal, Field, inp, MultiPick, Empty, fmt, PageHead } from '../components/ui'
function CreateProject({ onClose }: any) {
  const { dash, refresh } = useAuth(); const emps = dash?.employees?.list || []
  const [f, setF] = useState<any>({ name: '', project_code: '', description: '', start_date: '', end_date: '', project_head_id: '' })
  const [mem, setMem] = useState<string[]>([]); const [roles, setRoles] = useState<any>({}); const [busy, setBusy] = useState(false)
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: any) => {
    e.preventDefault()
    if (!f.name || !f.project_code || !f.start_date || !f.end_date || !f.project_head_id) return toast.error('Fill all required fields')
    if (f.end_date < f.start_date) return toast.error('End date must be after start date')
    setBusy(true)
    try { await projectApi.create({ ...f, members: mem.map(id => ({ user_id: id, project_role: roles[id] || 'Member' })) }); toast.success('Project created'); await refresh(); onClose() }
    catch (x) { toast.error(errMsg(x)) } finally { setBusy(false) }
  }
  return <Modal title="Create project" onClose={onClose} wide><form onSubmit={submit} className="space-y-3">
    <div className="grid gap-3 sm:grid-cols-2"><Field label="Project name *"><input className={inp} value={f.name} onChange={set('name')} /></Field><Field label="Project code *"><input className={inp} value={f.project_code} onChange={set('project_code')} /></Field></div>
    <Field label="Description"><textarea className={inp} rows={2} value={f.description} onChange={set('description')} /></Field>
    <div className="grid gap-3 sm:grid-cols-3"><Field label="Start date *"><input type="date" className={inp} value={f.start_date} onChange={set('start_date')} /></Field><Field label="End date *"><input type="date" className={inp} value={f.end_date} onChange={set('end_date')} /></Field>
      <Field label="Project head *"><select className={inp} value={f.project_head_id} onChange={set('project_head_id')}><option value="">Select</option>{emps.map((x: any) => <option key={x.id} value={x.id}>{x.full_name}</option>)}</select></Field></div>
    <Field label="Members"><MultiPick options={emps} value={mem} onChange={setMem} /></Field>
    {mem.map(id => <Field key={id} label={`Role: ${emps.find((x: any) => x.id === id)?.full_name}`}><input className={inp} placeholder="e.g. Backend developer" value={roles[id] || ''} onChange={e => setRoles({ ...roles, [id]: e.target.value })} /></Field>)}
    <Btn type="submit" loading={busy} className="w-full">Create project</Btn></form></Modal>
}
export default function Projects() {
  const { dash, isAdmin } = useAuth(); const [show, setShow] = useState(false); const list = dash?.assigned_projects?.list || []
  return <><PageHead title="Projects" sub={`${list.length} assigned`} action={isAdmin && <Btn onClick={() => setShow(true)}><Plus size={16} />New project</Btn>} />
    {!list.length ? <Empty text="No projects yet." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((p: any) => <Link key={p.id} to={`/projects/${p.id}`}><Card className="h-full p-5 transition hover:border-blue-300">
      <div className="flex justify-between"><span className="text-sm font-semibold text-blue-600">{p.project_code}</span><Badge v={p.is_active ? 'ACTIVE' : 'INACTIVE'} /></div>
      <h3 className="mt-1 text-lg font-bold">{p.name}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.description || 'No description'}</p>
      <div className="mt-4 space-y-1 text-xs text-slate-500"><div>Head: <b className="text-slate-700">{p.project_head_name}</b></div><div>{p.total_members} members · {fmt(p.start_date)} – {fmt(p.end_date)}</div><div>Your role: <b className="text-slate-700">{p.project_role}</b></div></div></Card></Link>)}</div>}
    {show && <CreateProject onClose={() => setShow(false)} />}</>
}
