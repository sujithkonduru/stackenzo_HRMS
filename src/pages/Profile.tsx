import { useAuth } from '../context/AuthContext'
import { Card, Avatar, Badge, fmtDT } from '../components/ui'
export default function Profile() {
  const { user, mustChange } = useAuth(); const D = (v: any) => v ?? '—'
  return <Card className="max-w-xl p-6"><div className="mb-5 flex items-center gap-4"><Avatar name={user?.full_name} size={64} /><div><div className="text-xl font-bold">{user?.full_name}</div><Badge v={user?.role} /></div></div>
    {mustChange && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Your account requires a password change. The backend documents no password-change endpoint yet, so this can't be done from here.</p>}
    <dl className="grid grid-cols-2 gap-3 text-sm">{[['Code', user?.employee_code], ['Email', user?.email], ['Title', user?.job_title], ['Department', user?.department], ['Last login', fmtDT(user?.last_login_at)]].map(([k, v]) => <div key={k as string}><dt className="text-slate-500">{k}</dt><dd className="font-medium">{D(v)}</dd></div>)}</dl></Card>
}
