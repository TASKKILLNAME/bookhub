import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import NewRecordPage from './pages/NewRecordPage';
import RecordDetailPage from './pages/RecordDetailPage';
import SharePage from './pages/SharePage';
import StoriesPage from './pages/StoriesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - no header/layout */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages - with header/layout */}
        <Route element={<Layout />}>
          <Route path="/profile" element={<MainPage />} />
          <Route path="/profile/settings" element={<ProfileSettingsPage />} />
          <Route path="/record/new" element={<NewRecordPage />} />
          <Route path="/record/:id" element={<RecordDetailPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
