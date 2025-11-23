import { createBrowserRouter } from 'react-router-dom';
import ListPage from './pages/ListPage/ListPage';
import ItemPage from './pages/ItemPage/ItemPage';
import StatsPage from './pages/StatsPage/StatsPage';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'list', element: <ListPage /> },
      { path: 'item/:id', element: <ItemPage /> },
      { path: 'stats', element: <StatsPage /> },
    ],
  },
]);
