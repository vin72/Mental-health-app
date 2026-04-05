import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="brand-icon">&#x1F9E0;</span> MindWell
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/mood" className={isActive('/mood')}>Mood</Link>
            <Link to="/journal" className={isActive('/journal')}>Journal</Link>
            <Link to="/resources" className={isActive('/resources')}>Resources</Link>
            <div className="nav-user">
              <span className="nav-username">{user.username}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/resources" className={isActive('/resources')}>Resources</Link>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
