'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MOCK_QUESTIONS } from '@/lib/data/mockData';
import { HelpCircle, PlusCircle, ThumbsUp, MessageSquare } from 'lucide-react';

export default function QuestionsPage() {
  const { t } = useTranslation();
  const [isAsking, setIsAsking] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [qList, setQList] = useState(MOCK_QUESTIONS);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newQ: any = {
      id: Date.now().toString(),
      author: { username: 'you', fullName: 'You' },
      title,
      slug: title.toLowerCase().replace(/ /g, '-'),
      details,
      destinationName: 'General Travel',
      helpfulVotes: 0,
      answerCount: 0,
      isAnswered: false,
      createdAt: new Date().toISOString()
    };
    setQList([newQ, ...qList]);
    setTitle('');
    setDetails('');
    setIsAsking(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-900 rounded-3xl p-8 text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-black">{t('nav.questions')}</h1>
          <p className="text-xs text-slate-300 mt-1">Get authentic advice from travelers who recently completed your route.</p>
        </div>
        <button
          onClick={() => setIsAsking(!isAsking)}
          className="px-5 py-2.5 rounded-2xl bg-brand-gradient text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {isAsking && (
        <form onSubmit={handleSubmitQuestion} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-navy-800">Ask the Travel Community</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is your question? (e.g. Can I visit Sajek under ৳5,000?)"
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none"
          />
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add relevant details (travel dates, starting city, group size)..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 text-white text-xs font-bold shadow-sm"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {qList.map((q) => (
          <Link
            key={q.id}
            href={`/questions/${q.slug}`}
            className="block bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600">
              <HelpCircle className="w-4 h-4" />
              <span>{q.destinationName}</span>
            </div>
            <h3 className="text-lg font-bold text-navy-800 hover:text-teal-600 transition-colors">{q.title}</h3>
            <p className="text-xs text-slate-500">{q.details}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
              <span>Asked by @{q.author.username}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {q.helpfulVotes}</span>
                <span className="font-bold text-teal-600 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {q.answerCount} Answers</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
