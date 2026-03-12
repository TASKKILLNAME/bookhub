import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, LogOut, User, Menu, X, Settings } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';

function Header() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { to: '/profile', label: '내 프로필' },
    { to: '/share', label: '경험공유' },
    { to: '/stories', label: '자유이야기' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: '#e6edf3',
            fontWeight: 700,
            fontSize: '1.15rem',
          }}
        >
          <BookOpen size={26} strokeWidth={2} />
          <span>BookHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-button)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive(link.to) ? 600 : 400,
                color: isActive(link.to) ? '#e6edf3' : '#8b949e',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.color = '#e6edf3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.color = '#8b949e';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          className="desktop-nav"
        >
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
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-button)',
                  color: '#e6edf3',
                  fontSize: '0.9rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 150ms',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3fb950, #58a6ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <User size={14} color="#fff" />
                </div>
                <span>{user.name}</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 4,
                    minWidth: 160,
                    backgroundColor: '#161b22',
                    border: '1px solid var(--color-border)',
                    borderRadius: 10,
                    padding: '4px 0',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    zIndex: 100,
                  }}
                >
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile/settings'); }}
                    className="header-dropdown-item"
                  >
                    <Settings size={15} />
                    프로필 설정
                  </button>
                  <div style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="header-dropdown-item"
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
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '6px 16px',
                  color: '#e6edf3',
                  transition: 'opacity 150ms',
                }}
              >
                로그인
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  padding: '6px 16px',
                  minHeight: 36,
                }}
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-button)',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#e6edf3',
            cursor: 'pointer',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            padding: '8px 16px 16px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'var(--color-surface)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-button)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: isActive(link.to) ? 600 : 400,
                color: isActive(link.to) ? '#e6edf3' : '#8b949e',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8, marginTop: 4 }}>
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  width: '100%',
                  borderRadius: 'var(--radius-button)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#8b949e',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                <LogOut size={18} />
                로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{ textDecoration: 'none', width: '100%', textAlign: 'center' }}
              >
                <LogIn size={18} />
                로그인
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .header-dropdown-item {
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
        .header-dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
