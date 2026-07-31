'use client';

import { HelpCircle, Book, MessageCircle, FileText, Phone } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    { q: "How does the Offline Generator work?", a: "The entire suite runs exclusively in your browser's local memory. No data is ever uploaded to a server, ensuring 100% confidentiality." },
    { q: "What is the Fisher-Yates Shuffle?", a: "It is a cryptographic algorithm used by the Question Paper Generator to ensure completely unbiased and unpredictable randomization of questions." },
    { q: "How do I open an .enc file?", a: "You cannot open it directly. You must provide the .enc file to the Printing Press, where they will use the Secure Decoder Portal and your password to print the paper." }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer">
          <Book size={32} className="text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800">Documentation</h3>
          <p className="text-xs text-slate-500 mt-2">Read the complete user manual for AKEMS.</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-200 text-center hover:border-emerald-300 transition-colors cursor-pointer">
          <MessageCircle size={32} className="text-emerald-500 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800">Contact IT</h3>
          <p className="text-xs text-slate-500 mt-2">Raise a ticket with the campus IT department.</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-200 text-center hover:border-purple-300 transition-colors cursor-pointer">
          <Phone size={32} className="text-purple-500 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800">Emergency Line</h3>
          <p className="text-xs text-slate-500 mt-2">Call the secure examination helpline.</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-slate-500" /> Frequently Asked Questions
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
              <h3 className="font-bold text-slate-800 text-lg mb-2">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
