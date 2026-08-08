import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export const AIInsights = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am PulseAI. I can analyze your churn data, segment behavior, and suggest retention strategies. What would you like to know today?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "What are the top 3 drivers of churn this month?",
    "Which segment is at highest risk right now?",
    "Generate a retention email for 'At Risk' customers.",
    "Why are 'Pro' plan users leaving?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: 'Based on the latest data, I found that users on the "Pro" plan are experiencing a higher churn rate due to low feature utilization (specifically, the API endpoints) and billing friction (failed credit card payments). I recommend a targeted campaign highlighting API use cases and an automated billing retry sequence.' 
        }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" /> AI Insights
        </h1>
        <p className="text-slate-400">Ask natural language questions about your customer data.</p>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              
              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested & Input Area */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-slate-700"
              >
                {q} <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your churn data..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
