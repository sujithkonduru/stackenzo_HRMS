import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, Table2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Card, Badge, Avatar, Modal, Empty, fmtDT, inp, PageHead } from '../components/ui'
export default function Employees() {
  const { dash } = useAuth(); const [sp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || ''); const [dep, setDep] = useState(''); const [role, setRole] = useState(''); const [act, setAct] = useState(''); const [grid, setGrid] = useState(true); const [sel, setSel] = useState<any>(null)
  const list = dash?.employees?.list || []
  const deps = [...new Set(list.map((x: any) => x.department).filter(Boolean))] as string[]
  const rows = list.filter((x: any) => (!q || [x.full_name, x.email, x.employee_code, x.job_title].join(' ').toLowerCase().includes(q.toLowerCase())) && (!dep || x.department === dep) && (!role || x.role === role) && (!act || String(x.is_active) === act))
  const D = (v: any) => v ?? '—'
  return <>
    <PageHead title="Employees" sub={`${rows.length} of ${list.length}`} action={<div className="flex gap-1"><button aria-label="Grid" onClick={() => setGrid(true)} className={`rounded p-2 ${grid ? 'bg-blue-50 text-blue-700' : ''}`}><LayoutGrid size={18} /></button><button aria-label="Table" onClick={() => setGrid(false)} className={`rounded p-2 ${!grid ? 'bg-blue-50 text-blue-700' : ''}`}><Table2 size={18} /></button></div>} />
    <div className="mb-4 grid gap-2 sm:grid-cols-4">
      <input className={inp} placeholder="Search name, email, code" value={q} onChange={e => setQ(e.target.value)} />
      <select className={inp} value={dep} onChange={e => setDep(e.target.value)}><option value="">All departments</option>{deps.map(d => <option key={d}>{d}</option>)}</select>
      <select className={inp} value={role} onChange={e => setRole(e.target.value)}><option value="">All roles</option><option>SUPER_ADMIN</option><option>ADMIN</option><option>EMPLOYEE</option></select>
      <select className={inp} value={act} onChange={e => setAct(e.target.value)}><option value="">Any status</option><option value="true">Active</option><option value="false">Inactive</option></select></div>
    {!rows.length ? <Empty text="No employees match these filters." /> : grid ?
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{rows.map((x: any) => <Card key={x.id} className="p-4"><button className="w-full text-left" onClick={() => setSel(x)}><div className="flex items-center gap-3"><Avatar name={x.full_name} size={44} /><div className="min-w-0"><div className="truncate font-semibold">{x.full_name}</div><div className="truncate text-xs text-slate-500">{D(x.job_title)} · {D(x.employee_code)}</div></div></div>
        <div className="mt-3 flex items-center justify-between"><Badge v={x.role} /><Badge v={x.is_active ? 'ACTIVE' : 'INACTIVE'} /></div></button></Card>)}</div> :
      <Card className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr>{['Name', 'Code', 'Email', 'Phone', 'Title', 'Dept', 'Role', 'Manager', 'Status', 'Last login'].map(h => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{rows.map((x: any) => <tr key={x.id} onClick={() => setSel(x)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"><td className="px-3 py-2 font-medium">{x.full_name}</td><td>{D(x.employee_code)}</td><td>{x.email}</td><td>{D(x.phone)}</td><td>{D(x.job_title)}</td><td>{D(x.department)}</td><td><Badge v={x.role} /></td><td>{D(x.manager_name)}</td><td><Badge v={x.is_active ? 'ACTIVE' : 'INACTIVE'} /></td><td>{fmtDT(x.last_login_at)}</td></tr>)}</tbody></table></Card>}
    {sel && <Modal title="Employee profile" onClose={() => setSel(null)}><div className="mb-4 flex items-center gap-3"><Avatar name={sel.full_name} size={56} /><div><div className="text-lg font-bold">{sel.full_name}</div><div className="text-sm text-slate-500">{D(sel.job_title)}</div></div></div>
      <dl className="grid grid-cols-2 gap-3 text-sm">{[['Code', sel.employee_code], ['Email', sel.email], ['Phone', sel.phone], ['Department', sel.department], ['Role', sel.role], ['Reports to', sel.manager_name], ['Last login', fmtDT(sel.last_login_at)], ['Status', sel.is_active ? 'Active' : 'Inactive']].map(([k, v]) => <div key={k as string}><dt className="text-slate-500">{k}</dt><dd className="break-words font-medium">{D(v)}</dd></div>)}</dl></Modal>}
  </>
}
