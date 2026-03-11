import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          padding: '24px 16px',
        }}
        className="page-enter"
      >
        <Outlet />
      </main>
      <footer
        style={{
          textAlign: 'center',
          padding: '20px 16px',
          color: '#6e7681',
          fontSize: '0.8rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <a href="/" style={{ color: '#8b949e', textDecoration: 'none' }}>BookHub</a> &copy; 2026
      </footer>
    </div>
  );
}

export default Layout;
