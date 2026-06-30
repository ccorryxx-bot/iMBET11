import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import DepositPage from './pages/DepositPage';
import PromotionPage from './pages/PromotionPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agent" element={<AgentNetworkPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/promotion" element={<PromotionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
