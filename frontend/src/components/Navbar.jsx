import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">SocialApp</Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search users..."
          className="navbar-search"
        />
      </div>

      <div className="navbar-right">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/explore" className="nav-link">🔍 Explore</Link>
        <Link to="/notifications" className="nav-link">🔔 Notifications</Link>
        <Link to={`/profile/${user?._id}`} className="nav-link">
          👤 Profile
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
