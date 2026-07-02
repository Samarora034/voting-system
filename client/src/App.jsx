import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PartyList from './pages/PartyList';
import PartyRegistration from './pages/PartyRegistration';
import VoterRegistration from './pages/VoterRegistration';
import VoterLogin from './pages/VoterLogin';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/parties" element={<PartyList />} />
            <Route path="/parties/register" element={<PartyRegistration />} />
            <Route path="/register" element={<VoterRegistration />} />
            <Route path="/login" element={<VoterLogin />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
