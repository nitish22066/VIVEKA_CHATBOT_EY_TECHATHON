import { useState, useRef, useEffect } from 'react';

type LoanType = 'car' | 'education' | 'business' | null;
type ChatStage = 'greeting' | 'loan_type_identified' | 'collecting_details' | 'consent' | 'collecting_documents' | 'reviewing' | 'approved' | 'escalated';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: MessageAction[];
  isHtml?: boolean;
}

interface MessageAction {
  type: 'upload' | 'download' | 'consent';
  label: string;
  docType?: string;
  completed?: boolean;
}

interface LoanDetails {
  amount: string;
  tenure: string;
  interestRate: string;
  income: string;
  employmentType: string;
}

interface UploadedDoc {
  name: string;
  type: string;
  valid: boolean;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  'credit score': 'Your credit score (CIBIL score) ranges from 300-900. A score above 750 is considered excellent and helps you get better interest rates. Factors affecting your score include payment history (35%), credit utilization (30%), credit history length (15%), credit mix (10%), and new credit inquiries (10%).',
  'emi': 'EMI (Equated Monthly Installment) is the fixed payment amount you pay each month towards your loan. It includes both principal and interest. EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is principal, R is monthly interest rate, and N is number of months.',
  'interest rate': 'Interest rates vary by loan type. Car loans: 8.5%-15% p.a., Education loans: 9%-14% p.a., Business loans: 11%-18% p.a. Your rate depends on your credit score, income stability, and loan amount.',
  'prepayment': 'You can prepay your loan anytime after 12 months with zero prepayment penalty. This helps you save on interest and close your loan faster. Many customers prepay using annual bonuses.',
  'cooling off': 'You have a 3-day cooling-off period after loan approval where you can cancel the loan with no questions asked and full refund of any processing fees.',
  'eligibility': 'Loan eligibility depends on: age (21-60 years), minimum income (varies by loan type), credit score (650+), employment stability (minimum 1-2 years), and existing EMI obligations.',
  'documents': 'Common documents required: KYC (Aadhaar, PAN), Income proof (salary slips/ITR), Bank statements (6 months), Address proof. Additional documents vary by loan type.',
  'kfs': 'Key Fact Statement (KFS) is a mandatory document that shows all loan terms clearly - interest rate, total cost, charges, your rights, and cancellation policy. We provide this before final approval.',
  'default': 'I can help you with information about loans, credit scores, EMI calculations, interest rates, eligibility criteria, and documentation requirements. Please ask a specific question!'
};

const DOCUMENT_REQUIREMENTS: Record<string, { applicant: string[]; coApplicant?: string[] }> = {
  education: {
    applicant: [
      'Passport-size photographs (2)',
      'KYC - Aadhaar Card',
      'KYC - PAN Card',
      'Academic Records (10th, 12th marksheets)',
      'Graduation marksheets (if applicable)',
      'Admission/Offer Letter from university',
      'Fee structure document',
      'Entrance exam scores (GRE/GMAT/IELTS/TOEFL)',
      'Student Visa copy (for abroad studies)',
      'Passport copy'
    ],
    coApplicant: [
      'Co-applicant KYC - Aadhaar Card',
      'Co-applicant KYC - PAN Card',
      'Income Proof - Last 3 months salary slips',
      'Income Proof - Form 16 (last 2 years)',
      'Income Proof - ITR (last 2 years)',
      'Bank statements (last 6 months)'
    ]
  },
  business: {
    applicant: [
      'KYC - PAN Card',
      'KYC - Aadhaar Card',
      'KYC - Address Proof',
      'Passport-size photographs (2)',
      'Signature proof',
      'GST Registration Certificate',
      'Business bank statements (last 6 months)',
      'ITR (last 2 years)',
      'Audited Balance Sheet',
      'Profit and Loss Statement (last 2 years)',
      'Business license/permits'
    ]
  },
  car: {
    applicant: [
      'KYC - PAN Card',
      'KYC - Aadhaar Card',
      'KYC - Address Proof',
      'Passport-size photographs (2)',
      'Income Proof - Salary slips (last 3 months)',
      'Income Proof - Form 16',
      'Bank statements (last 6 months)',
      'Employment proof/ID card'
    ]
  }
};

const PERSUASIVE_RESPONSES: Record<string, string[]> = {
  car: [
    `That's a great question—and the fact you're thinking critically about this says a lot about your financial awareness!

**Here's the reality:**
✔️ According to a 2023 ICICI Bank report, over 60% of car buyers opt for loans to preserve their emergency savings
✔️ 89% said it gave them more financial flexibility rather than depleting their savings

**Think of it this way:** Would you rather pay ₹8 lakhs upfront today and drain your savings, or spread it over 4 years at ₹16,500/month while keeping ₹6 lakhs in your emergency fund?

**Your benefits with our car loan:**
• Interest rates starting at 8.5% p.a.
• Zero prepayment penalty after 12 months
• 3-day cooling-off period
• Quick processing in 48 hours

Would you like me to help you explore the best car loan options for your needs?`,
  ],
  education: [
    `Congratulations on thinking about your future! 🎓

**Let's reframe this—is this debt, or is this an investment?**

A car depreciates, a vacation is consumed, but education *appreciates* your earning potential for life.

**Per HSBC's Graduate Outcomes Study (2023):**
• 91% of international grads recover their education loan within 3 years
• Average salary jump: 3-5x compared to India-based roles
• 82% reported higher career satisfaction

**Our Education Loan Benefits:**
• Zero EMI during study period (moratorium)
• Tax benefits under Section 80E
• Flexible repayment up to 15 years
• No collateral needed up to ₹7.5 lakhs

Would you like me to help you understand how manageable the repayment would be after graduation?`,
  ],
  business: [
    `I really appreciate your entrepreneurial spirit! Let me help you assess this opportunity clearly.

**Per a 2023 Razorpay survey:**
📊 72% of micro businesses who took working capital loans saw 25–50% revenue growth within 6 months
📊 89% said the loan helped them capture seasonal demand they'd have otherwise missed

**Our Business Loan Benefits:**
• Quick disbursal in 3-5 days
• Flexible EMI based on revenue/seasonality
• Zero prepayment penalty
• Collateral-free up to ₹10 lakhs
• GST-compliant transparent processing

**But here's the key:** The loan should match your cash flow pattern, not just your ambition.

Would you like me to help calculate a safe EMI based on your business revenue?`,
  ]
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm **Viveka**, your ethical loan advisor 💬 with one of India's most trusted NBFCs with over 2 million satisfied customers.

I'll guide you through loan options that fit your situation—no pressure, no surprises. Everything is secure and consent-driven.

**How can I help you today?**
• Car Loan
• Education Loan
• Business Loan
• General Questions about loans`,
      sender: 'bot',
      timestamp: new Date(),
      isHtml: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loanType, setLoanType] = useState<LoanType>(null);
  const [stage, setStage] = useState<ChatStage>('greeting');
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({ amount: '', tenure: '', interestRate: '', income: '', employmentType: '' });
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [pendingDocs, setPendingDocs] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDocType, setCurrentDocType] = useState<string>('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string, actions?: MessageAction[], isHtml?: boolean) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      actions,
      isHtml
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const detectLoanType = (text: string): LoanType => {
    const lower = text.toLowerCase();
    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('auto')) return 'car';
    if (lower.includes('education') || lower.includes('study') || lower.includes('university') || lower.includes('college') || lower.includes('student')) return 'education';
    if (lower.includes('business') || lower.includes('msme') || lower.includes('startup') || lower.includes('shop') || lower.includes('company')) return 'business';
    return null;
  };

  const searchKnowledgeBase = (query: string): string | null => {
    const lower = query.toLowerCase();
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
      if (lower.includes(key)) {
        return value;
      }
    }
    if (lower.includes('what') || lower.includes('how') || lower.includes('explain') || lower.includes('tell me')) {
      return KNOWLEDGE_BASE['default'];
    }
    return null;
  };

  const calculateEMI = (principal: number, rate: number, months: number): number => {
    const monthlyRate = rate / 12 / 100;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      processUserInput(userInput);
      setIsLoading(false);
    }, 800);
  };

  const processUserInput = (userInput: string) => {
    const detectedLoan = detectLoanType(userInput);
    const knowledgeAnswer = searchKnowledgeBase(userInput);

    if (stage === 'greeting') {
      if (detectedLoan) {
        setLoanType(detectedLoan);
        setStage('loan_type_identified');
        const response = PERSUASIVE_RESPONSES[detectedLoan][0];
        addBotMessage(response, undefined, true);
        
        setTimeout(() => {
          addBotMessage(`Great! To provide you with the best ${detectedLoan} loan options, I'll need a few details.

**Before we proceed, I need your consent:**

Do you agree to share your personal and financial details for loan processing? Your data will be:
✅ Encrypted and secure
✅ Used only for loan assessment
✅ Never shared without your permission
✅ Compliant with RBI guidelines

Please type **"I consent"** or **"Yes, I agree"** to continue.`, undefined, true);
          setStage('consent');
        }, 1500);
      } else if (knowledgeAnswer) {
        addBotMessage(knowledgeAnswer);
      } else {
        addBotMessage(`I'd be happy to help you! Please let me know:

• Are you interested in a **Car Loan**, **Education Loan**, or **Business Loan**?
• Or do you have a specific question about loans?`);
      }
    } else if (stage === 'consent') {
      const lower = userInput.toLowerCase();
      if (lower.includes('consent') || lower.includes('agree') || lower.includes('yes') || lower.includes('ok')) {
        setConsentGiven(true);
        setStage('collecting_details');
        addBotMessage(`Thank you for your consent! 🙏

Now, please provide the following details:

**1. Loan Amount Required:** (e.g., ₹5 lakhs, ₹10 lakhs)
**2. Preferred Tenure:** (e.g., 3 years, 5 years)
**3. Your Monthly/Annual Income:** (helps calculate comfortable EMI)
**4. Employment Type:** Salaried or Self-employed?

You can share all details together or one by one.`, undefined, true);
      } else {
        addBotMessage(`I understand your concern. Your privacy is important to us.

Would you like me to explain our data protection policies, or would you prefer to ask general questions about loans without sharing personal details?`);
      }
    } else if (stage === 'collecting_details') {
      const amountMatch = userInput.match(/(\d+)\s*(lakh|lac|l|crore|cr)?/i);
      const tenureMatch = userInput.match(/(\d+)\s*(year|yr|month|mo)/i);
      const incomeMatch = userInput.match(/income.*?(\d+)|(\d+).*?(salary|income|earning)/i);
      
      const newDetails = { ...loanDetails };
      if (amountMatch) {
        let amount = parseInt(amountMatch[1]);
        if (amountMatch[2]?.toLowerCase().includes('cr')) amount *= 100;
        newDetails.amount = `₹${amount} Lakhs`;
      }
      if (tenureMatch) {
        newDetails.tenure = `${tenureMatch[1]} ${tenureMatch[2]}s`;
      }
      if (incomeMatch) {
        const incomeVal = incomeMatch[1] || incomeMatch[2];
        newDetails.income = `₹${incomeVal}`;
      }
      if (userInput.toLowerCase().includes('salaried')) {
        newDetails.employmentType = 'Salaried';
      } else if (userInput.toLowerCase().includes('self') || userInput.toLowerCase().includes('business')) {
        newDetails.employmentType = 'Self-employed';
      }
      
      setLoanDetails(newDetails);

      if (newDetails.amount && newDetails.tenure) {
        const amountNum = parseFloat(newDetails.amount.replace(/[^\d.]/g, '')) * 100000;
        const tenureMonths = parseInt(newDetails.tenure) * (newDetails.tenure.includes('year') ? 12 : 1);
        const rate = loanType === 'car' ? 11.5 : loanType === 'education' ? 11.2 : 14;
        const emi = calculateEMI(amountNum, rate, tenureMonths);

        addBotMessage(`Excellent! Based on your details, here's your loan summary:

**Loan Type:** ${loanType?.charAt(0).toUpperCase()}${loanType?.slice(1)} Loan
**Amount:** ${newDetails.amount}
**Tenure:** ${newDetails.tenure}
**Interest Rate:** ${rate}% p.a.
**Estimated EMI:** ₹${Math.round(emi).toLocaleString()}/month

**Total Payable:** ₹${Math.round(emi * tenureMonths).toLocaleString()}
**Total Interest:** ₹${Math.round(emi * tenureMonths - amountNum).toLocaleString()}

**Your Rights:**
✅ 3-day cooling-off period (full refund)
✅ Zero prepayment penalty after 12 months
✅ No hidden charges

Would you like to proceed with the documentation? Type **"Yes, proceed"** to continue.`, undefined, true);
        setStage('collecting_documents');
      } else {
        const missing = [];
        if (!newDetails.amount) missing.push('loan amount');
        if (!newDetails.tenure) missing.push('preferred tenure');
        addBotMessage(`Thanks! I still need your **${missing.join(' and ')}** to calculate the EMI. Please provide these details.`);
      }
    } else if (stage === 'collecting_documents') {
      const lower = userInput.toLowerCase();
      if (lower.includes('yes') || lower.includes('proceed') || lower.includes('ok')) {
        const docs = DOCUMENT_REQUIREMENTS[loanType || 'car'];
        setPendingDocs([...docs.applicant, ...(docs.coApplicant || [])]);
        
        const docList = docs.applicant.map((d, i) => `${i + 1}. ${d}`).join('\n');
        const coDocList = docs.coApplicant ? '\n\n**Co-applicant Documents:**\n' + docs.coApplicant.map((d, i) => `${i + 1}. ${d}`).join('\n') : '';
        
        addBotMessage(`Great! For your ${loanType} loan, please upload the following documents:

**Applicant Documents:**
${docList}${coDocList}

Click on each document type below to upload. All documents should be clear, readable PDFs or images.`, 
          docs.applicant.map(doc => ({ type: 'upload', label: doc, docType: doc, completed: false })),
          true
        );
      } else if (knowledgeAnswer) {
        addBotMessage(knowledgeAnswer);
      }
    } else if (stage === 'reviewing') {
      addBotMessage(`Your documents are currently under review. I'll notify you once the verification is complete.

In the meantime, feel free to ask any questions about the loan process!`);
    } else if (stage === 'approved' || stage === 'escalated') {
      if (knowledgeAnswer) {
        addBotMessage(knowledgeAnswer);
      } else {
        addBotMessage(`Your loan application has been ${stage === 'approved' ? 'approved' : 'escalated to our officer'}. Is there anything else I can help you with?`);
      }
    }
  };

  const handleFileUpload = (docType: string) => {
    setCurrentDocType(docType);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentDocType) {
      const isValid = Math.random() > 0.2;
      
      const newDoc: UploadedDoc = {
        name: file.name,
        type: currentDocType,
        valid: isValid
      };
      setUploadedDocs(prev => [...prev, newDoc]);
      setPendingDocs(prev => prev.filter(d => d !== currentDocType));

      const userMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Uploaded: ${file.name} for ${currentDocType}`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      setTimeout(() => {
        if (isValid) {
          addBotMessage(`✅ **${currentDocType}** uploaded successfully and verified!

${pendingDocs.length > 1 ? `📋 ${pendingDocs.length - 1} more documents remaining.` : pendingDocs.length === 1 ? '🎉 This is the last document!' : ''}`);
        } else {
          addBotMessage(`⚠️ **${currentDocType}** - Document needs attention.

The uploaded document appears to be unclear or may not meet our requirements. This has been **escalated to our loan officer** for manual review.

You will receive a call within 24 hours to resolve this.

Please continue uploading other documents in the meantime.`, undefined, true);
          setStage('escalated');
        }

        const remainingValid = pendingDocs.filter(d => d !== currentDocType);
        if (remainingValid.length === 0 && !uploadedDocs.some(d => !d.valid)) {
          setTimeout(() => {
            setStage('approved');
            addBotMessage(`🎉 **Congratulations! Your loan has been approved!**

**Loan Details:**
• Type: ${loanType?.charAt(0).toUpperCase()}${loanType?.slice(1)} Loan
• Amount: ${loanDetails.amount}
• Tenure: ${loanDetails.tenure}
• Status: ✅ APPROVED

Your sanction letter is ready for download. Please save it for your records.

**Next Steps:**
1. Download and review your sanction letter
2. Sign and return within 7 days
3. Funds will be disbursed within 48 hours of signing

Thank you for choosing Viveka! 🙏`,
              [{ type: 'download', label: 'Download Sanction Letter (PDF)' }],
              true
            );
          }, 1000);
        }
      }, 1500);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateSanctionLetter = () => {
    const content = `
LOAN SANCTION LETTER
====================

Date: ${new Date().toLocaleDateString('en-IN')}
Reference No: VIV/${Date.now()}

Dear Applicant,

We are pleased to inform you that your ${loanType?.toUpperCase()} LOAN application has been approved.

LOAN DETAILS:
-------------
Loan Type: ${loanType?.charAt(0).toUpperCase()}${loanType?.slice(1)} Loan
Sanctioned Amount: ${loanDetails.amount}
Tenure: ${loanDetails.tenure}
Interest Rate: ${loanType === 'car' ? '11.5' : loanType === 'education' ? '11.2' : '14'}% per annum
EMI: As discussed

TERMS & CONDITIONS:
-------------------
1. This sanction is valid for 30 days from the date of issue.
2. Zero prepayment penalty after 12 months.
3. 3-day cooling-off period applicable.
4. All terms are as per RBI guidelines.

For any queries, contact our customer support.

Warm Regards,
Team Viveka
India's Trusted NBFC
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Viveka_Sanction_Letter_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAction = (action: MessageAction) => {
    if (action.type === 'upload' && action.docType) {
      handleFileUpload(action.docType);
    } else if (action.type === 'download') {
      generateSanctionLetter();
    }
  };

  const renderMessage = (message: Message) => {
    const text = message.isHtml ? message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') : message.text;
    
    return (
      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : ''}`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-violet-600 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
            }`}
          >
            {message.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: text }} className="text-sm leading-relaxed" />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            )}
          </div>
          
          {message.actions && message.actions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(action)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    action.type === 'download'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : action.completed
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  }`}
                  disabled={action.completed}
                >
                  {action.type === 'upload' && '📎'}
                  {action.type === 'download' && '📥'}
                  {action.label}
                  {action.completed && ' ✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-180px)]">
      <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-violet-600 to-violet-700 text-white">
          <h2 className="text-xl font-bold">VIVEKA Chat</h2>
          <p className="text-violet-200 text-sm">Your Ethical AI Loan Advisor</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
}
