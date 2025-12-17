export function Footer() {
  return (
    <footer className="bg-violet-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">VIVEKA</h3>
            <p className="text-violet-200">AI-Powered Loan Assistant helping you make better financial decisions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-violet-200">
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/knowledge" className="hover:text-white">Knowledge Center</a></li>
              <li><a href="/planner" className="hover:text-white">Budget Planner</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-violet-200">Need help? Start a chat with our AI assistant.</p>
          </div>
        </div>
        <div className="border-t border-violet-700 mt-8 pt-8 text-center text-violet-200">
          <p>&copy; 2024 VIVEKA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
