// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ margin: '0 1rem' }}>Dashboard</Link>
      <Link to="/purchases" style={{ margin: '0 1rem' }}>Purchases</Link>
      <Link to="/transfers" style={{ margin: '0 1rem' }}>Transfers</Link>
      <Link to="/assignments" style={{ margin: '0 1rem' }}>Assignments</Link>
      <Link to="/login" style={{ margin: '0 1rem' }}>Login</Link>
    </nav>
  );
};

export default Navbar;
