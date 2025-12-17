export function KnowledgeCenter() {
  const topics = [
    {
      title: 'Understanding Credit Scores',
      description: 'Learn how credit scores work and what factors affect them.',
      icon: '📊'
    },
    {
      title: 'Loan Types Explained',
      description: 'Comprehensive guide to different types of loans available.',
      icon: '📚'
    },
    {
      title: 'Interest Rates Guide',
      description: 'How interest rates are calculated and how to get the best rates.',
      icon: '💰'
    },
    {
      title: 'EMI Calculator Tips',
      description: 'Calculate and plan your monthly installments effectively.',
      icon: '🧮'
    },
    {
      title: 'Loan Documentation',
      description: 'Required documents and how to prepare your loan application.',
      icon: '📋'
    },
    {
      title: 'Credit Improvement',
      description: 'Strategies to improve your credit score over time.',
      icon: '📈'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Knowledge Center</h1>
      <p className="text-violet-200 text-center mb-12">Explore our comprehensive financial resources</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-4xl mb-4">{topic.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{topic.title}</h3>
            <p className="text-gray-600">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
