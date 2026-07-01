import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import DepositPage from './pages/DepositPage';
import PromotionPage from './pages/PromotionPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';

function AppShell() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-brand-bg">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/agent" element={<AgentNetworkPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
