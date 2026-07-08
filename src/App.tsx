import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { UserPage } from './pages/UserPage';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/work/:id" element={<WorkDetailPage />} />
            <Route path="/user/:id" element={<UserPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
