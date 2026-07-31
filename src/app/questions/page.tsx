'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { supabase } from '@/lib/supabase/supabase';
import { Question } from '@/lib/types';
import { HelpCircle, PlusCircle, ThumbsUp, MessageSquare, Compass } from 'lucide-react';

export default function QuestionsPage() {
  const { t } = useTranslation();
  const [isAsking, setIsAsking] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('questions')
          .select(`
            *,
            author:profiles(*)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setQuestions(data.map((q: any): Question => ({
            id: q.id,
            authorId: q.author_id,
            author: {
              id: q.author?.id || 'anon',
              fullName: q.author?.full_name || 'Traveler',
              username: q.author?.username || 'traveler',
              avatarUrl: q.author?.avatar_url || '',
              bio: q.author?.bio || '',
              homeCity: q.author?.home_city || 'Bangladesh',
              preferredLanguage: q.author?.preferred_language || 'en',
              districtsVisitedCount: q.author?.districts_visited_count || 0,
              tripsCount: q.author?.trips_count || 0,
              helpfulVotesCount: q.author?.helpful_votes_count || 0,
              followersCount: q.author?.followers_count || 0,
              followingCount: q.author?.following_count || 0,
              isVerified: q.author?.is_verified || false,
              createdAt: q.author?.created_at || q.created_at
            },
            title: q.title,
            slug: q.slug,
            details: q.details,
            destinationName: q.destination_name || 'General Travel',
            contentLanguage: q.content_language || 'en',
            helpfulVotes: q.helpful_votes || 0,
            answerCount: q.answer_count || 0,
            isAnswered: q.is_answered || false,
            createdAt: q.created_at
          })));
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !supabase) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to ask a question.');
        setSubmitting(false);
        return;
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const { data: newQ, error } = await supabase
        .from('questions')
        .insert({
          author_id: user.id,
          title: title.trim(),
          slug: `${slug}-${Date.now()}`,
          details: details.trim(),
          destination_name: 'General Travel'
        })
        .select(`*, author:profiles(*)`)
        .single();

      if (error) {
        alert(`Error submitting question: ${error.message}`);
      } else if (newQ) {
        const formattedQ: Question = {
          id: newQ.id,
          authorId: newQ.author_id,
          author: {
            id: newQ.author?.id || user.id,
            fullName: newQ.author?.full_name || 'You',
            username: newQ.author?.username || 'you',
            avatarUrl: newQ.author?.avatar_url || '',
            bio: newQ.author?.bio || '',
            homeCity: newQ.author?.home_city || 'Bangladesh',
            preferredLanguage: newQ.author?.preferred_language || 'en',
            districtsVisitedCount: 0,
            tripsCount: 0,
            helpfulVotesCount: 0,
            followersCount: 0,
            followingCount: 0,
            isVerified: false,
            createdAt: newQ.created_at
          },
          title: newQ.title,
          slug: newQ.slug,
          details: newQ.details,
          destinationName: newQ.destination_name || 'General Travel',
          contentLanguage: 'en',
          helpfulVotes: 0,
          answerCount: 0,
          isAnswered: false,
          createdAt: newQ.created_at
        };
        setQuestions([formattedQ, ...questions]);
        setTitle('');
        setDetails('');
        setIsAsking(false);
      }
    } catch (err) {
      console.error('Failed to submit question:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-black font-heading">{t('nav.questions')}</h1>
          <p className="text-xs text-slate-300 mt-1">Get authentic advice from travelers who recently completed your route.</p>
        </div>
        <button
          onClick={() => setIsAsking(!isAsking)}
          className="px-5 py-2.5 rounded-2xl bg-brand-purple text-white font-bold text-xs shadow-md hover:bg-brand-purple/90 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-brand-cyan" />
          <span>Ask a Question</span>
        </button>
      </div>

      {isAsking && (
        <form onSubmit={handleSubmitQuestion} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Ask the Travel Community</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is your question? (e.g. Can I visit Sajek under ৳5,000?)"
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
            required
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add more details or specifics about transport, accommodation, budget, or dates..."
            rows={4}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-brand-purple"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAsking(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-sm hover:bg-brand-purple/90"
            >
              {submitting ? 'Submitting...' : 'Post Question'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading community Q&A...</div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-brand-purple">{q.destinationName}</span>
                <span>Asked by @{q.author?.username || 'traveler'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">{q.title}</h3>
              {q.details && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{q.details}</p>}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{q.helpfulVotes} Helpful</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{q.answerCount} Answers</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white font-heading">No Questions Posted Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Be the first traveler to ask a question about bus fares, hotel costs, or route safety in Bangladesh!
          </p>
        </div>
      )}
    </div>
  );
}
