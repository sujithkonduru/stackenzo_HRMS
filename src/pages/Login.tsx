import { useState } from 'react'
import { Eye, EyeOff, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { errMsg } from '../api/axiosInstance'
import { Btn, Field, inp } from '../components/ui'
export default function Login() {
  const { login } = useAuth(); const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const submit = async (e: any) => {
    e.preventDefault(); setErr('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.')
    if (pw.length < 1) return setErr('Enter your password.')
    setBusy(true)
    try { await login(email, pw) } catch (x) { setErr(errMsg(x)); toast.error(errMsg(x)) } finally { setBusy(false) }
  }
  return <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white"><Briefcase size={18} /></span>HRMS</div>
      <p className="text-sm text-slate-500">Sign in to manage your projects and tasks.</p>
      <Field label="Email"><input type="email" className={inp} value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" /></Field>
      <Field label="Password"><div className="relative"><input type={show ? 'text' : 'password'} className={inp} value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" />
        <button type="button" aria-label="Toggle password" onClick={() => setShow(!show)} className="absolute right-2 top-2.5 text-slate-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></Field>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <Btn type="submit" loading={busy} className="w-full">Sign in</Btn></form></div>
}
