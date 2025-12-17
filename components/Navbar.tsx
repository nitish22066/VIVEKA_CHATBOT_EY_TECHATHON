import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-violet-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl">
            VIVEKA
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-violet-200 transition-colors">Home</Link>
            <Link to="/chat" className="hover:text-violet-200 transition-colors">Chat</Link>
            <Link to="/faq" className="hover:text-violet-200 transition-colors">FAQ</Link>
            <Link to="/knowledge" className="hover:text-violet-200 transition-colors">Knowledge</Link>
            <Link to="/planner" className="hover:text-violet-200 transition-colors">Planner</Link>
            <Link to="/trust" className="hover:text-violet-200 transition-colors">Trust</Link>
            <Link to="/community" className="hover:text-violet-200 transition-colors">Community</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
