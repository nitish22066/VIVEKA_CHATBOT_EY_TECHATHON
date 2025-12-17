import { useState } from 'react';

export function BudgetPlanner() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('12');

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const months = parseInt(tenure) || 12;
    const rate = 0.10 / 12;
    
    if (principal <= 0) return 0;
    
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return isNaN(emi) ? 0 : emi.toFixed(2);
  };

  const savings = (parseFloat(income) || 0) - (parseFloat(expenses) || 0);
  const emi = calculateEMI();
  const affordable = savings > parseFloat(emi as string);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Budget Planner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Income & Expenses</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Monthly Income</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your monthly income"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 mb-2">Monthly Expenses</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="Enter your monthly expenses"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-gray-600">Monthly Savings: <span className={`font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{savings.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">EMI Calculator</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Loan Amount</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 mb-2">Tenure (months)</label>
              <select
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </select>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-gray-600">Estimated EMI: <span className="font-bold text-violet-600">₹{emi}</span></p>
              {loanAmount && (
                <p className={`mt-2 ${affordable ? 'text-green-600' : 'text-red-600'}`}>
                  {affordable ? '✓ This loan fits your budget' : '✗ This EMI exceeds your savings'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
