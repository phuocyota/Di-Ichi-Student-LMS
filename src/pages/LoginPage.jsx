import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import { getAccessToken, setAccessToken } from '../auth/authStorage.js';
import { login } from '../services/authApi.js';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (getAccessToken()) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const result = await login(email.trim(), password);
      if (result.userType !== 'STUDENT') {
        throw new Error('Tài khoản này không phải tài khoản học sinh');
      }
      setAccessToken(result.accessToken);
      navigate(location.state?.from || '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-orange-100">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-orange-50 text-[#F97316]">
          <GraduationCap className="h-11 w-11" />
        </div>
        <h1 className="mt-5 text-center text-3xl font-black text-slate-900">Đăng nhập học sinh</h1>
        <p className="mt-2 text-center font-semibold text-slate-500">Vào lớp học trực tuyến bằng tài khoản Di-Ichi.</p>
        <label className="mt-7 block text-sm font-black text-slate-700">
          Email
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-orange-100 px-4 py-3 font-semibold outline-none focus:border-orange-400" />
        </label>
        <label className="mt-4 block text-sm font-black text-slate-700">
          Mật khẩu
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-orange-100 px-4 py-3 font-semibold outline-none focus:border-orange-400" />
        </label>
        {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-600">{error}</p> : null}
        <button disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F97316] py-4 text-lg font-black text-white disabled:opacity-60">
          <LogIn className="h-5 w-5" />
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
