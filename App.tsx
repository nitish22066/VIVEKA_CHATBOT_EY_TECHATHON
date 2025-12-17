import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FAQ } from './pages/FAQ';
import { KnowledgeCenter } from './pages/KnowledgeCenter';
import { BudgetPlanner } from './pages/BudgetPlanner';
import { Chatbot } from './pages/Chatbot';
import { Trust } from './pages/Trust';
import { SMSAssist } from './pages/SMSAssist';
import { Community } from './pages/Community';
import { LocateBranch } from './pages/LocateBranch';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-violet-600 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/knowledge" element={<KnowledgeCenter />} />
            <Route path="/planner" element={<BudgetPlanner />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/sms-assist" element={<SMSAssist />} />
            <Route path="/community" element={<Community />} />
            <Route path="/branches" element={<LocateBranch />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
