import { useState } from 'react';

const faqs = [
  {
    question: 'What is VIVEKA?',
    answer: 'VIVEKA is an AI-powered loan assistant that helps you understand loan eligibility, compare options, and make informed financial decisions.'
  },
  {
    question: 'How do I check my loan eligibility?',
    answer: 'Simply start a chat with our AI assistant and provide basic information about your income, credit score, and loan requirements. VIVEKA will guide you through the process.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security seriously. All communications are encrypted, and we never share your personal information without consent.'
  },
  {
    question: 'What types of loans can VIVEKA help with?',
    answer: 'VIVEKA can assist with personal loans, home loans, car loans, education loans, and business loans.'
  },
  {
    question: 'How does the credit score checker work?',
    answer: 'Our credit score insights help you understand factors affecting your score and provide tips to improve it over time.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="text-violet-600">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
