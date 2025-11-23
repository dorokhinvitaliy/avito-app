import './App.css';

import { NavLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 20, padding: 10 }}>
        <NavLink to="/list">Список объявлений</NavLink>
        <NavLink to="/stats">Статистика</NavLink>
      </nav>

      <Outlet />
    </div>
  );
}

export default App;
