import { X, Loader2 } from 'lucide-react'
export const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const fmtDT = (d?: string) => d ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Never'
export const initials = (n?: string) => (n || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
export const isOverdue = (t: any) => t.deadline_at && new Date(t.deadline_at) < new Date() && !['COMPLETED', 'CANCELLED'].includes(t.assignment_status || t.status)
export const Card = ({ className = '', children }: any) => <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}>{children}</div>
export const Btn = ({ variant = 'primary', loading, className = '', children, ...p }: any) => (
  <button disabled={loading || p.disabled} {...p} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed min-h-10 ${variant === 'primary' ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'} ${className}`}>
    {loading && <Loader2 size={16} className="animate-spin" />}{children}</button>)
const tone: any = { HIGH: 'bg-red-50 text-red-700', MEDIUM: 'bg-amber-50 text-amber-700', LOW: 'bg-emerald-50 text-emerald-700', ASSIGNED: 'bg-slate-100 text-slate-700', ACKNOWLEDGED: 'bg-blue-50 text-blue-700', IN_PROGRESS: 'bg-indigo-50 text-indigo-700', COMPLETED: 'bg-emerald-50 text-emerald-700', CANCELLED: 'bg-slate-100 text-slate-500', OVERDUE: 'bg-red-50 text-red-700', ACTIVE: 'bg-emerald-50 text-emerald-700', INACTIVE: 'bg-slate-100 text-slate-500' }
export const Badge = ({ v, label }: any) => <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${tone[v] || 'bg-slate-100 text-slate-700'}`}>{label || String(v).replace('_', ' ')}</span>
export const Progress = ({ value = 0 }: any) => <div className="h-2 w-full rounded-full bg-slate-100" role="progressbar" aria-valuenow={Number(value)}><div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${Math.min(100, Number(value) || 0)}%` }} /></div>
export const Avatar = ({ name, size = 32 }: any) => <span title={name} style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{initials(name)}</span>
export const Empty = ({ text }: any) => <div className="py-10 text-center text-sm text-slate-500">{text}</div>
export const Spinner = () => <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" /></div>
export const Field = ({ label, children }: any) => <label className="block text-sm font-medium text-slate-700">{label}<div className="mt-1">{children}</div></label>
export const inp = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-10 focus:border-blue-500'
export const PageHead = ({ title, sub, action }: any) => <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">{title}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div>{action}</div>
export function Modal({ title, onClose, children, wide }: any) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
    <div role="dialog" aria-label={title} onClick={e => e.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-slate-100"><X size={18} /></button></div>{children}</div></div>
}
export function MultiPick({ options, value, onChange }: any) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x: string) => x !== id) : [...value, id])
  return <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-300 p-1">{options.map((o: any) => (
    <label key={o.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-50"><input type="checkbox" checked={value.includes(o.id)} onChange={() => toggle(o.id)} />{o.full_name}<span className="text-xs text-slate-400">{o.job_title}</span></label>))}</div>
}
