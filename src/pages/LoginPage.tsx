import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithOAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : err.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 160px)', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #58a6ff)', marginBottom: 16 }}>
            <BookOpen size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e6edf3', marginBottom: 6 }}>로그인</h1>
          <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>BookHub에 오신 것을 환영합니다</p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-input)', backgroundColor: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', fontSize: '0.85rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#e6edf3', marginBottom: 6 }}>이메일</label>
            <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#e6edf3', marginBottom: 6 }}>비밀번호</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} className="input-field" style={{ paddingRight: 44 }} placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6e7681', padding: 4, display: 'flex' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: 4, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? '로그인 중...' : <><LogIn size={18} /><span>로그인</span></>}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: '0.8rem', color: '#6e7681' }}>또는</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* 소셜 로그인 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => loginWithOAuth('google')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-button)',
              border: '1px solid var(--color-border)', backgroundColor: '#161b22',
              color: '#e6edf3', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
              transition: 'border-color 150ms, background-color 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b949e'; e.currentTarget.style.backgroundColor = '#1c2129'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = '#161b22'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google로 계속하기
          </button>
          <button
            onClick={() => loginWithOAuth('kakao')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-button)',
              border: '1px solid rgba(254, 229, 0, 0.3)', backgroundColor: '#FEE500',
              color: '#191919', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.68 1.75 5.04 4.4 6.38-.14.51-.9 3.28-.93 3.5 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.62.09 1.26.14 1.92.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" fill="#191919"/></svg>
            카카오로 계속하기
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: '#8b949e' }}>
          계정이 없으신가요?{' '}
          <Link to="/register" style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 600 }}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
