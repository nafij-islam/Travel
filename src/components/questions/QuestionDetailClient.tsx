'use client';

import React, { useState } from 'react';
import { Question } from '@/lib/types';
import { HelpCircle, ThumbsUp, CheckCircle2 } from 'lucide-react';

interface QuestionDetailClientProps {
  question: Question;
}

export const QuestionDetailClient: React.FC<QuestionDetailClientProps> = ({ question }) => {
  const [answers, setAnswers] = useState([
    {
      id: 'ans-1',
      author: 'Nafij Islam',
      username: 'nafij_travels',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isVerified: true,
      content: 'Yes! Take non-AC Shanti Paribahan bus from Dhaka Kalabagan (৳700 each way). Then at Khagrachari counter, join another 4-person group to reserve a ৳4,500 Chander Gari together!',
      votes: 18,
      isAccepted: true
    }
  ]);
  const [newAns, setNewAns] = useState('');

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAns.trim()) return;
    setAnswers([
      ...answers,
      {
        id: Date.now().toString(),
        author: 'You',
        username: 'you',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        isVerified: false,
        content: newAns,
        votes: 0,
        isAccepted: false
      }
    ]);
    setNewAns('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Question Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-purple">
          <HelpCircle className="w-4 h-4 text-brand-sky" />
          <span>{question.destinationName}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">{question.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">{question.details}</p>
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          Asked by @{question.author.username} · {answers.length} Community Answers
        </div>
      </div>

      {/* Answers List */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 font-heading">Community Answers ({answers.length})</h3>
        {answers.map((ans) => (
          <div key={ans.id} className={`p-6 rounded-3xl border space-y-3 ${ans.isAccepted ? 'bg-brand-cyan/20 border-brand-cyan' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={ans.avatarUrl} alt={ans.author} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {ans.author} {ans.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />}
                  </div>
                  <div className="text-[10px] text-slate-400">@{ans.username}</div>
                </div>
              </div>
              {ans.isAccepted && (
                <span className="px-3 py-1 rounded-full bg-brand-green text-slate-900 font-bold text-[10px]">
                  ✓ Accepted Answer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{ans.content}</p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  ans.votes += 1;
                  setAnswers([...answers]);
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-brand-cyan/40 text-slate-700 font-bold flex items-center gap-1"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-brand-purple" />
                <span>Helpful ({ans.votes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Answer */}
      <form onSubmit={handlePostAnswer} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-slate-900 font-heading">Your Answer</h4>
        <textarea
          rows={3}
          value={newAns}
          onChange={(e) => setNewAns(e.target.value)}
          placeholder="Share your travel advice or cost experiences..."
          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
        />
        <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-purple text-white font-bold text-xs">
          Submit Answer
        </button>
      </form>
    </div>
  );
};
