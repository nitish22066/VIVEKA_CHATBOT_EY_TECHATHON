export function Community() {
  const discussions = [
    { title: 'Tips for first-time loan applicants', replies: 24, author: 'FinanceGuru' },
    { title: 'How I improved my credit score by 100 points', replies: 56, author: 'CreditChamp' },
    { title: 'Best practices for loan repayment', replies: 18, author: 'MoneyWise' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Community</h1>
      <p className="text-violet-200 text-center mb-12">Connect with others on their financial journey</p>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Popular Discussions</h2>
        </div>
        
        <div className="divide-y">
          {discussions.map((discussion, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
              <h3 className="font-medium text-gray-800 mb-2">{discussion.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>By {discussion.author}</span>
                <span>{discussion.replies} replies</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 text-center">
          <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            Join the Community
          </button>
        </div>
      </div>
    </div>
  );
}
