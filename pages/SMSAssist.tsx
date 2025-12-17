export function SMSAssist() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-4 text-center">SMS Assist</h1>
      <p className="text-violet-200 text-center mb-12">Get loan updates and assistance via SMS</p>
      
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stay Connected</h2>
        <p className="text-gray-600 mb-6">
          Register your phone number to receive loan updates, payment reminders, and quick assistance via SMS.
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
              Register
            </button>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-violet-50 rounded-lg">
            <h4 className="font-semibold text-violet-600">Payment Reminders</h4>
            <p className="text-sm text-gray-600">Never miss a payment deadline</p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg">
            <h4 className="font-semibold text-violet-600">Application Status</h4>
            <p className="text-sm text-gray-600">Track your loan application</p>
          </div>
          <div className="p-4 bg-violet-50 rounded-lg">
            <h4 className="font-semibold text-violet-600">Quick Support</h4>
            <p className="text-sm text-gray-600">Get help when you need it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
