export function LocateBranch() {
  const branches = [
    { name: 'Mumbai Central', address: '123 Business District, Mumbai 400001', phone: '+91 22 1234 5678' },
    { name: 'Delhi NCR', address: '456 Financial Hub, New Delhi 110001', phone: '+91 11 2345 6789' },
    { name: 'Bangalore Tech Park', address: '789 IT Corridor, Bangalore 560001', phone: '+91 80 3456 7890' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">Locate a Branch</h1>
      <p className="text-violet-200 text-center mb-12">Find our nearest branch for in-person assistance</p>
      
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your city or PIN code"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            Search
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {branches.map((branch, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{branch.name}</h3>
                <p className="text-gray-600 mb-1">{branch.address}</p>
                <p className="text-violet-600">{branch.phone}</p>
              </div>
              <button className="px-4 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50">
                Get Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
