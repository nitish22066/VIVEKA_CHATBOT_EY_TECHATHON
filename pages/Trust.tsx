export function Trust() {
  const trustFeatures = [
    {
      title: 'Data Encryption',
      description: 'All your data is encrypted using industry-standard AES-256 encryption.',
      icon: '🔐'
    },
    {
      title: 'Privacy First',
      description: 'We never sell or share your personal information with third parties.',
      icon: '🛡️'
    },
    {
      title: 'Secure Infrastructure',
      description: 'Our systems are hosted on secure, certified cloud infrastructure.',
      icon: '☁️'
    },
    {
      title: 'Regulatory Compliance',
      description: 'We comply with all relevant financial regulations and data protection laws.',
      icon: '✓'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Trust & Security</h1>
      <p className="text-violet-200 text-center mb-12">Your security is our top priority</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
