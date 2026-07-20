import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/AuthContext';
import { Compass, Search, LogOut } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.appContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.navContent}>
          <Link to="/" style={styles.logoLink}>
            <span style={styles.logoBadge}>EN</span>
            <span style={styles.logoText}>InglesAsFácil</span>
          </Link>

          <nav style={styles.navMenu}>
            <Link to="/browse" style={styles.navLink}>
              <Compass size={18} />
              <span>Catálogo</span>
            </Link>
            <Link to="/search" style={styles.navLink}>
              <Search size={18} />
              <span>Busca</span>
            </Link>
          </nav>

          <div style={styles.userSection}>
            {isAuthenticated ? (
              <div style={styles.profileBox}>
                <div style={styles.avatar}>
                  {user?.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={styles.userDetails}>
                  <span style={styles.username}>{user?.username}</span>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton} title="Sair">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={styles.authButtons}>
                <Link to="/login" style={styles.loginLink}>Entrar</Link>
                <Link to="/register" style={styles.registerButton}>Cadastrar</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerBrand}>InglesAsFácil &copy; {new Date().getFullYear()}</p>
          <p style={styles.footerText}>
            Aprenda inglês com séries, filmes e expressões reais do YouTube. Pratique sua pronúncia com Inteligência Artificial.
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#0f172a'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 24px'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    height: '70px',
    margin: '0 auto'
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  logoBadge: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: '800',
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1e293b'
  },
  navMenu: {
    display: 'flex',
    gap: '24px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'color 0.2s'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center'
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f1f5f9',
    padding: '6px 12px',
    borderRadius: '9999px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '12px'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  username: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155'
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '4px',
    transition: 'color 0.2s'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  loginLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '600',
    fontSize: '15px'
  },
  registerButton: {
    textDecoration: 'none',
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
  },
  main: {
    flex: 1,
    padding: '40px 24px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    padding: '40px 24px',
    marginTop: '60px',
    borderTop: '1px solid #1e293b'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  footerBrand: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    margin: 0
  },
  footerText: {
    fontSize: '14px',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  }
};
export default PageLayout;
