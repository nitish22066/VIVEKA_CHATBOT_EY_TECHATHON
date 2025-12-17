import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Welcome to VIVEKA
        </h1>
        <p className="text-xl text-violet-200 mb-8">
          Your AI-Powered Financial Guide for Smarter Loan Decisions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/chat" 
            className="bg-white text-violet-600 px-8 py-3 rounded-lg font-semibold hover:bg-violet-100 transition-colors"
          >
            Start Chatting
          </Link>
          <Link 
            to="/knowledge" 
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors"
          >
            Learn More
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-violet-500 bg-opacity-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">AI Assistant</h3>
            <p className="text-violet-200">Get personalized loan guidance from our intelligent chatbot.</p>
          </div>
          <div className="bg-violet-500 bg-opacity-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">Budget Planning</h3>
            <p className="text-violet-200">Plan your finances with our smart budget tools.</p>
          </div>
          <div className="bg-violet-500 bg-opacity-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-3">Knowledge Base</h3>
            <p className="text-violet-200">Access comprehensive financial resources and guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
