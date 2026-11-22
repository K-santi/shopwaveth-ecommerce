import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { selectUser, useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import FormField from '../components/FormField';
import { isEmail } from '../utils/validators';

const RULES = {
  name: (v) => (v.trim().length < 2 ? 'กรุณากรอกชื่อของคุณ' : ''),
  email: (v) => (isEmail(v) ? '' : 'กรุณากรอกอีเมลให้ถูกต้อง'),
  password: (v) => (v.length < 6 ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : ''),
};

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore(selectUser);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const showToast = useToastStore((state) => state.show);

  const next = params.get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';

  const [mode, setMode] = useState('login');
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={safeNext} replace />;

  const fields = mode === 'register' ? ['name', 'email', 'password'] : ['email', 'password'];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setErrors((current) => ({ ...current, [name]: RULES[name](values[name]) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    fields.forEach((name) => {
      const message = RULES[name](values[name]);
      if (message) nextErrors[name] = message;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'register') {
        await register(values);
        showToast('สมัครสมาชิกสำเร็จ ยินดีต้อนรับ!');
      } else {
        await login(values);
        showToast('เข้าสู่ระบบสำเร็จ');
      }
      navigate(safeNext, { replace: true });
    } catch (error) {
      setFormError(error.message);
      setSubmitting(false);
    }
  };

  const tab = (active) =>
    `flex-1 rounded-full py-2.5 text-sm font-medium transition ${
      active ? 'bg-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
    }`;

  return (
    <div className="mx-auto max-w-md py-6">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight">
        {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
      </h1>

      <div className="mb-6 flex rounded-full bg-tile p-1" role="tablist">
        <button role="tab" aria-selected={mode === 'login'} className={tab(mode === 'login')} onClick={() => { setMode('login'); setErrors({}); setFormError(''); }}>
          เข้าสู่ระบบ
        </button>
        <button role="tab" aria-selected={mode === 'register'} className={tab(mode === 'register')} onClick={() => { setMode('register'); setErrors({}); setFormError(''); }}>
          สมัครสมาชิก
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === 'register' && (
          <FormField label="ชื่อ" name="name" autoComplete="name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} />
        )}
        <FormField label="อีเมล" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
        <FormField
          label="รหัสผ่าน"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          hint={mode === 'register' ? 'อย่างน้อย 6 ตัวอักษร' : undefined}
        />

        {formError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 py-3.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {mode === 'login' ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
        </button>
      </form>

      <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
        ระบบสมาชิกในโปรเจกต์นี้เป็นแบบจำลอง เก็บข้อมูลในเบราว์เซอร์ของคุณเท่านั้น ไม่มีเซิร์ฟเวอร์ และไม่ควรใช้รหัสผ่านจริง
      </p>
    </div>
  );
}
