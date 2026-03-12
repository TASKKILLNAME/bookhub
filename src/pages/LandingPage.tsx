import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  GitBranch,
  Star,
  Users,
  MessageCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Share2,
  ChevronRight,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// Grass grid data (stable across renders)
const COLS = 30;
const ROWS = 7;
const grassBaseColors: number[][] = Array.from({ length: COLS }, () =>
  Array.from({ length: ROWS }, () => Math.random())
);

function getGrassColor(r: number, boost: number): string {
  const t = Math.min(r + boost, 1);
  if (t > 0.85) return '#39d353';
  if (t > 0.7) return '#26a641';
  if (t > 0.55) return '#006d32';
  if (t > 0.4) return '#0e4429';
  return '#161b22';
}

function GrassPreviewSection() {
  const [hoverPos, setHoverPos] = useState<{ col: number; row: number } | null>(null);

  const getBoost = (col: number, row: number): number => {
    if (!hoverPos) return 0;
    const dist = Math.sqrt((col - hoverPos.col) ** 2 + (row - hoverPos.row) ** 2);
    if (dist > 5) return 0;
    return Math.max(0, 0.5 * (1 - dist / 5));
  };

  return (
    <section style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, top: 0, background: 'radial-gradient(ellipse, rgba(63, 185, 80, 0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>
          독서 잔디를 심으세요
        </h2>
        <p style={{ color: '#8b949e', fontSize: '1rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          매일 읽은 책을 기록하면 깃허브처럼 잔디가 채워집니다.
          <br />나의 독서 습관을 한눈에 확인하세요.
        </p>

        <div
          style={{
            background: '#161b22', borderRadius: 12, border: '1px solid #30363d',
            padding: '24px 28px', display: 'inline-block',
          }}
          onMouseLeave={() => setHoverPos(null)}
        >
          <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            {grassBaseColors.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {col.map((r, ri) => {
                  const boost = getBoost(ci, ri);
                  const color = getGrassColor(r, boost);
                  const glowing = boost > 0.15;
                  return (
                    <div
                      key={ri}
                      onMouseEnter={() => setHoverPos({ col: ci, row: ri })}
                      style={{
                        width: 14, height: 14, borderRadius: 3,
                        backgroundColor: color,
                        boxShadow: glowing ? `0 0 ${6 + boost * 10}px ${color}` : 'none',
                        transform: glowing ? `scale(${1 + boost * 0.3})` : 'scale(1)',
                        transition: 'all 200ms ease-out',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ========== NAV ========== */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: scrolled ? 'rgba(13, 17, 23, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #21262d' : '1px solid transparent',
        transition: 'all 250ms ease',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#e6edf3', fontWeight: 700, fontSize: '1.15rem' }}>
            <BookOpen size={26} strokeWidth={2} />
            <span>BookHub</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="landing-desktop-nav">
            {[
              { to: '/share', label: '경험공유' },
              { to: '/stories', label: '자유이야기' },
            ].map((link) => (
              <Link
                key={link.to} to={link.to}
                style={{ padding: '6px 16px', textDecoration: 'none', fontSize: '0.9rem', color: '#8b949e', transition: 'color 150ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#e6edf3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="landing-desktop-nav">
            {user ? (
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => {
                  if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
                }}
              >
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 6,
                  color: '#e6edf3', fontSize: '0.9rem', transition: 'background 150ms',
                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #3fb950, #58a6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={13} color="#fff" />
                  </div>
                  {user.name}
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 4,
                    minWidth: 160, backgroundColor: '#161b22',
                    border: '1px solid var(--color-border)', borderRadius: 10,
                    padding: '4px 0', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)', zIndex: 200,
                  }}>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/profile/settings'); }}
                      className="landing-dropdown-item"
                    >
                      <Settings size={15} />
                      프로필 설정
                    </button>
                    <div style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="landing-dropdown-item"
                      style={{ color: '#f85149' }}
                    >
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={{ padding: '6px 16px', textDecoration: 'none', fontSize: '0.9rem', color: '#e6edf3', transition: 'opacity 150ms' }}>
                  로그인
                </Link>
                <Link to="/register" style={{
                  padding: '6px 18px', borderRadius: 6, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                  background: '#238636', color: '#fff', border: '1px solid rgba(240,246,252,0.1)',
                  transition: 'background 150ms', minHeight: 34, display: 'inline-flex', alignItems: 'center',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#2ea043'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#238636'; }}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="landing-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, border: 'none', backgroundColor: 'transparent', color: '#e6edf3', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="landing-mobile-menu" style={{
            padding: '8px 16px 16px', backgroundColor: 'rgba(13, 17, 23, 0.95)', backdropFilter: 'blur(12px)',
            borderTop: '1px solid #21262d', display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            {[
              { to: '/share', label: '경험공유' },
              { to: '/stories', label: '자유이야기' },
              ...(user
                ? [{ to: '/profile', label: '내 프로필' }]
                : [{ to: '/login', label: '로그인' }, { to: '/register', label: '회원가입' }]),
            ].map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                style={{ padding: '10px 16px', borderRadius: 6, textDecoration: 'none', fontSize: '0.95rem', color: '#8b949e' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        .landing-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 14px;
          border: none;
          background: none;
          color: #e6edf3;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 150ms;
        }
        .landing-dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
        }
        @media (max-width: 768px) {
          .landing-desktop-nav { display: none !important; }
          .landing-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .landing-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* ========== HERO ========== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse at center, rgba(56, 139, 253, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(63, 185, 80, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(188, 140, 255, 0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(#e6edf3 1px, transparent 1px), linear-gradient(90deg, #e6edf3 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 800, padding: '0 24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999, marginBottom: 28,
            background: 'rgba(56, 139, 253, 0.1)', border: '1px solid rgba(56, 139, 253, 0.2)',
            fontSize: '0.82rem', color: '#58a6ff', fontWeight: 500,
          }}>
            <Sparkles size={14} />
            독서를 기록하고 공유하는 새로운 방법
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#e6edf3' }}>당신의 독서 여정을</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #58a6ff, #3fb950, #bc8cff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              코드처럼 기록하세요
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#8b949e', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' }}>
            독서 기록을 잔디처럼 쌓고, 책 경험을 커밋하고,
            <br />
            다른 독서인들과 함께 성장하세요.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/profile" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 8,
                background: 'linear-gradient(135deg, #238636, #2ea043)',
                color: '#fff', fontWeight: 600, fontSize: '1rem',
                textDecoration: 'none', transition: 'all 150ms',
                border: '1px solid rgba(240, 246, 252, 0.1)',
              }}>
                내 프로필 <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #238636, #2ea043)',
                  color: '#fff', fontWeight: 600, fontSize: '1rem',
                  textDecoration: 'none', transition: 'all 150ms',
                  border: '1px solid rgba(240, 246, 252, 0.1)',
                }}>
                  시작하기 <ArrowRight size={18} />
                </Link>
                <Link to="/share" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 8,
                  background: 'transparent',
                  color: '#e6edf3', fontWeight: 500, fontSize: '1rem',
                  textDecoration: 'none', transition: 'all 150ms',
                  border: '1px solid var(--color-border)',
                }}>
                  둘러보기
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { value: '1,200+', label: '등록된 책', icon: <BookOpen size={16} /> },
              { value: '350+', label: '독서 기록', icon: <GitBranch size={16} /> },
              { value: '89', label: '활동 유저', icon: <Users size={16} /> },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: '#58a6ff', marginBottom: 4 }}>
                  {stat.icon}
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e6edf3' }}>{stat.value}</span>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#6e7681' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GRASS PREVIEW ========== */}
      <GrassPreviewSection />

      {/* ========== FEATURES ========== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>
              독서의 모든 것을 한곳에
            </h2>
            <p style={{ color: '#8b949e', fontSize: '1rem' }}>
              기록하고, 평가하고, 공유하세요.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                icon: <BookOpen size={24} />,
                color: '#3fb950',
                bg: 'rgba(63, 185, 80, 0.1)',
                border: 'rgba(63, 185, 80, 0.2)',
                title: '독서 기록',
                desc: '읽은 책을 검색하고, 별점과 감상을 남기세요. 카카오 API로 표지와 정보를 자동으로 가져옵니다.',
              },
              {
                icon: <BarChart3 size={24} />,
                color: '#58a6ff',
                bg: 'rgba(56, 139, 253, 0.1)',
                border: 'rgba(56, 139, 253, 0.2)',
                title: '독서 통계',
                desc: '잔디 그래프, 장르 분포, 평균 평점 등 나의 독서 패턴을 한눈에 파악할 수 있습니다.',
              },
              {
                icon: <Star size={24} />,
                color: '#e3b341',
                bg: 'rgba(227, 179, 65, 0.1)',
                border: 'rgba(227, 179, 65, 0.2)',
                title: '나만의 순위',
                desc: '내가 읽은 책 중 최고의 책을 순위로 정리하세요. 나만의 추천 목록이 완성됩니다.',
              },
              {
                icon: <Share2 size={24} />,
                color: '#bc8cff',
                bg: 'rgba(188, 140, 255, 0.1)',
                border: 'rgba(188, 140, 255, 0.2)',
                title: '경험 공유',
                desc: '독서 기록을 다른 사람들과 공유하고, 좋아요와 댓글로 소통하세요.',
              },
              {
                icon: <MessageCircle size={24} />,
                color: '#f778ba',
                bg: 'rgba(247, 120, 186, 0.1)',
                border: 'rgba(247, 120, 186, 0.2)',
                title: '자유 이야기',
                desc: '독서 추천, 독서 팁, 자유로운 주제로 다른 독서인들과 이야기를 나눠보세요.',
              },
              {
                icon: <Users size={24} />,
                color: '#8b949e',
                bg: 'rgba(139, 148, 158, 0.1)',
                border: 'rgba(139, 148, 158, 0.2)',
                title: '프로필',
                desc: '나의 독서 활동을 프로필 페이지에서 한눈에 확인하고, 독서 여정을 관리하세요.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  padding: 28,
                  borderRadius: 12,
                  border: `1px solid ${feature.border}`,
                  backgroundColor: '#0d1117',
                  transition: 'border-color 200ms, transform 200ms',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = feature.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  backgroundColor: feature.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feature.color, marginBottom: 16,
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e6edf3', marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#8b949e', lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid #21262d' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: '#e6edf3', marginBottom: 48 }}>
            시작하는 법
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, textAlign: 'left' }}>
            {[
              { step: '01', title: '가입하기', desc: '아이디와 닉네임만으로 간편하게 시작', color: '#3fb950' },
              { step: '02', title: '책 검색 & 기록', desc: '카카오 API로 책을 검색하고 별점과 감상을 남기기', color: '#58a6ff' },
              { step: '03', title: '잔디 채우기', desc: '매일 기록할수록 잔디가 초록색으로 가득 차요', color: '#bc8cff' },
              { step: '04', title: '공유 & 소통', desc: '나의 기록을 공유하고 다른 사람들과 이야기하기', color: '#f778ba' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
                {/* Vertical line */}
                {i < 3 && (
                  <div style={{
                    position: 'absolute', left: 19, top: 44, bottom: -8,
                    width: 2, backgroundColor: '#21262d',
                  }} />
                )}
                {/* Circle */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${item.color}`, backgroundColor: '#0d1117',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: item.color,
                  position: 'relative', zIndex: 1,
                }}>
                  {item.step}
                </div>
                <div style={{ paddingBottom: 36 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e6edf3', marginBottom: 4 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section style={{
        padding: '80px 24px', textAlign: 'center', position: 'relative',
        borderTop: '1px solid #21262d',
      }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(56, 139, 253, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#e6edf3', marginBottom: 12 }}>
            오늘부터 독서 잔디를 심어보세요
          </h2>
          <p style={{ color: '#8b949e', fontSize: '1rem', marginBottom: 32 }}>
            무료로 시작할 수 있습니다
          </p>

          <Link
            to={user ? '/profile' : '/register'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 40px', borderRadius: 8,
              background: 'linear-gradient(135deg, #238636, #2ea043)',
              color: '#fff', fontWeight: 600, fontSize: '1.05rem',
              textDecoration: 'none',
              border: '1px solid rgba(240, 246, 252, 0.1)',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(35, 134, 54, 0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {user ? '내 프로필로 이동' : '무료로 시작하기'} <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px', textAlign: 'center',
        borderTop: '1px solid #21262d',
        color: '#6e7681', fontSize: '0.82rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
          <Link to="/share" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#e6edf3'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}>경험공유</Link>
          <Link to="/stories" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#e6edf3'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}>자유이야기</Link>
          <Link to="/login" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#e6edf3'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}>로그인</Link>
        </div>
        BookHub &copy; 2026
      </footer>
    </div>
  );
}

export default LandingPage;
