import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { Card, Badge, Progress, Empty, fmt, PageHead, isOverdue } from '../components/ui'
import { TaskDetail } from './Tasks'
import { useState } from 'react'
const Stat = ({ l, v }: any) => <Card className="p-4"><div className="text-sm text-slate-500">{l}</div><div className="mt-1 text-2xl font-bold">{v ?? 0}</div></Card>
export default function Dashboard() {
  const { dash, user, isAdmin } = useAuth(); const [sel, setSel] = useState<any>(null)
  if (!dash) return <Empty text="Dashboard data is unavailable. Check your connection." />
  const s = dash.summary || {}, e = dash.employees?.summary, tasks = dash.tasks || [], projects = dash.assigned_projects?.list || []
  const status = [{ n: 'Pending', v: s.pending, c: '#94a3b8' }, { n: 'Acknowledged', v: s.acknowledged, c: '#3b82f6' }, { n: 'In progress', v: s.in_progress, c: '#6366f1' }, { n: 'Completed', v: s.completed, c: '#10b981' }]
  const prio = [{ n: 'High', v: s.high_priority }, { n: 'Medium', v: s.medium_priority }, { n: 'Low', v: s.low_priority }]
  const upcoming = [...tasks].filter(t => t.deadline_at && !['COMPLETED', 'CANCELLED'].includes(t.assignment_status)).sort((a, b) => +new Date(a.deadline_at) - +new Date(b.deadline_at)).slice(0, 5)
  const pendingAck = tasks.filter((t: any) => t.assignment_status === 'ASSIGNED' && !t.acknowledged_at)
  return <>
    <PageHead title={`Welcome, ${user?.full_name?.split(' ')[0]}`} sub={`${dash.access_scope?.tasks?.replaceAll('_', ' ').toLowerCase() || ''} · ${dash.date}`} />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat l="Total tasks" v={s.total} /><Stat l="Assignments" v={s.total_assignments} /><Stat l="Pending" v={s.pending} /><Stat l="Acknowledged" v={s.acknowledged} />
      <Stat l="In progress" v={s.in_progress} /><Stat l="Completed" v={s.completed} /><Stat l="High priority" v={s.high_priority} /><Stat l="Projects" v={dash.assigned_projects?.summary?.total} />
      {isAdmin && e && <><Stat l="Employees" v={e.total} /><Stat l="Active" v={e.active} /><Stat l="Inactive" v={e.inactive} /></>}
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card className="p-5"><h2 className="mb-2 font-bold">Task status</h2>{s.total ? <div className="h-56"><ResponsiveContainer><PieChart><Pie data={status} dataKey="v" nameKey="n" innerRadius={55} outerRadius={85}>{status.map(x => <Cell key={x.n} fill={x.c} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div> : <Empty text="No tasks yet." />}
        <div className="flex flex-wrap gap-3 text-xs">{status.map(x => <span key={x.n} className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: x.c }} />{x.n} {x.v}</span>)}</div></Card>
      <Card className="p-5"><h2 className="mb-2 font-bold">Priority</h2><div className="h-56"><ResponsiveContainer><BarChart data={prio}><XAxis dataKey="n" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="v" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      <Card className="p-5"><h2 className="mb-3 font-bold">Upcoming deadlines</h2>{upcoming.length ? upcoming.map((t: any) => <button key={t.assignment_id} onClick={() => setSel(t)} className="flex w-full items-center justify-between gap-2 border-b border-slate-100 py-2 text-left text-sm last:border-0"><span className="truncate">{t.title} <span className="text-slate-400">· {t.employee_name}</span></span><span className={isOverdue(t) ? 'text-red-600' : 'text-slate-500'}>{fmt(t.deadline_at)}</span></button>) : <Empty text="Nothing due." />}</Card>
      <Card className="p-5"><h2 className="mb-3 font-bold">Pending acknowledgements <span className="text-slate-400">({pendingAck.length})</span></h2>{pendingAck.slice(0, 5).map((t: any) => <button key={t.assignment_id} onClick={() => setSel(t)} className="flex w-full justify-between border-b border-slate-100 py-2 text-left text-sm last:border-0"><span className="truncate">{t.employee_name}: {t.description}</span><Badge v={t.priority} /></button>)}{!pendingAck.length && <Empty text="All acknowledged." />}</Card>
      <Card className="p-5 lg:col-span-2"><div className="mb-3 flex justify-between"><h2 className="font-bold">Projects</h2><Link to="/projects" className="text-sm text-blue-600">View all</Link></div>
        {projects.length ? <div className="grid gap-3 md:grid-cols-2">{projects.map((p: any) => <Link key={p.id} to={`/projects/${p.id}`} className="rounded-lg border border-slate-200 p-3 hover:border-blue-300"><div className="font-semibold">{p.name} <span className="text-xs text-slate-400">{p.project_code}</span></div><div className="mb-2 text-xs text-slate-500">{fmt(p.start_date)} – {fmt(p.end_date)} · {p.total_members} members</div><Progress value={0} /><div className="mt-1 text-xs text-slate-400">Open the project to see progress</div></Link>)}</div> : <Empty text="No projects assigned." />}</Card>
    </div>
    {sel && <TaskDetail t={sel} onClose={() => setSel(null)} />}
  </>
}
