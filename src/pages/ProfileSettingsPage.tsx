import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Link2, Unlink } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

function ProfileSettingsPage() {
  const { user, linkIdentity, getLinkedProviders } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    getLinkedProviders().then(setLinkedProviders);
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await supabase.from('profiles').update({ name, bio }).eq('id', user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleLink = async (provider: 'google' | 'kakao') => {
    setLinkError('');
    try {
      await linkIdentity(provider);
    } catch (err: any) {
      setLinkError(err.message || '연결에 실패했습니다.');
    }
  };

  const providers = [
    {
      id: 'email',
      name: '이메일',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-10 7L2 7" />
        </svg>
      ),
      color: '#8b949e',
    },
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
      color: '#4285F4',
    },
    {
      id: 'kakao',
      name: '카카오',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.68 1.75 5.04 4.4 6.38-.14.51-.9 3.28-.93 3.5 0 0-.02.17.09.23.11.07.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.62.09 1.26.14 1.92.14 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" fill="#FEE500"/>
        </svg>
      ),
      color: '#FEE500',
    },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/profile" style={{ color: '#8b949e', display: 'flex' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e6edf3' }}>프로필 설정</h1>
      </div>

      {/* Profile Edit */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 20 }}>기본 정보</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#e6edf3', marginBottom: 6 }}>닉네임</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#e6edf3', marginBottom: 6 }}>소개</label>
            <textarea
              className="input-field"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button
            onClick={handleSaveProfile}
            className="btn-primary"
            disabled={saving}
            style={{ alignSelf: 'flex-start', opacity: saving ? 0.7 : 1 }}
          >
            {saved ? <><Check size={16} /> 저장됨</> : saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 8 }}>연결된 계정</h2>
        <p style={{ fontSize: '0.85rem', color: '#8b949e', marginBottom: 20 }}>
          여러 로그인 방법을 하나의 계정에 연결하세요
        </p>

        {linkError && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-input)', backgroundColor: 'rgba(248, 81, 73, 0.1)', border: '1px solid rgba(248, 81, 73, 0.4)', color: '#f85149', fontSize: '0.85rem', marginBottom: 16 }}>
            {linkError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {providers.map((provider) => {
            const isLinked = linkedProviders.includes(provider.id);
            return (
              <div
                key={provider.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 8,
                  backgroundColor: '#161b22',
                  border: `1px solid ${isLinked ? 'rgba(63, 185, 80, 0.3)' : 'var(--color-border)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {provider.icon}
                  <span style={{ fontSize: '0.9rem', color: '#e6edf3', fontWeight: 500 }}>
                    {provider.name}
                  </span>
                </div>

                {isLinked ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#3fb950', fontWeight: 500 }}>
                    <Link2 size={14} />
                    연결됨
                  </span>
                ) : provider.id === 'email' ? (
                  <span style={{ fontSize: '0.8rem', color: '#6e7681' }}>
                    이메일 가입 시 자동 연결
                  </span>
                ) : (
                  <button
                    onClick={() => handleLink(provider.id as 'google' | 'kakao')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: '#e6edf3', fontSize: '0.8rem', fontWeight: 500,
                      cursor: 'pointer', transition: 'border-color 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b949e'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  >
                    <Link2 size={14} />
                    연결하기
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Info */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 16 }}>계정 정보</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#8b949e' }}>이메일</span>
            <span style={{ color: '#e6edf3' }}>{user?.email || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#8b949e' }}>ID</span>
            <span style={{ color: '#6e7681', fontSize: '0.75rem' }}>{user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsPage;
