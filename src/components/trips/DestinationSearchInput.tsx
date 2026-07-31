'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, Search, Plus, Sparkles, Check, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { Destination } from '@/lib/types';
import { MOCK_DESTINATIONS } from '@/lib/data/mockData';

interface DestinationSearchInputProps {
  value: string; // Current destination slug or text
  onChange: (selected: { slug: string; nameEn: string; nameBn?: string; isCustom?: boolean }) => void;
  destinations?: Destination[];
}

/**
 * Normalizes destination spacing and capitalization
 */
export function normalizeDestinationName(text: string): string {
  if (!text) return '';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  // Capitalize English words, leave Bangla text intact
  return trimmed
    .split(' ')
    .map((word) => {
      if (/^[a-zA-Z]/.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word;
    })
    .join(' ');
}

/**
 * Generates URL-friendly slug
 */
export function generateDestinationSlug(text: string): string {
  const normalized = normalizeDestinationName(text);
  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
    .replace(/^-+|-+$/g, '') || `dest-${Date.now().toString(36)}`;
}

/**
 * Levenshtein distance for fuzzy duplicate detection
 */
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenB; i++) matrix[i] = [i];
  for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[lenB][lenA];
}

export function DestinationSearchInput({
  value,
  onChange,
  destinations = MOCK_DESTINATIONS
}: DestinationSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize selected item from prop value
  useEffect(() => {
    const matched = destinations.find((d) => d.slug === value || d.nameEn.toLowerCase() === value.toLowerCase());
    if (matched) {
      setSelectedDestination(matched);
      setQuery(matched.nameEn);
    } else if (value) {
      setQuery(value);
    }
  }, [value, destinations]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = useMemo(() => normalizeDestinationName(query), [query]);

  // Search filter across English & Bangla names & district
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return destinations;
    const q = query.toLowerCase().trim();
    return destinations.filter((d) => {
      const matchEn = d.nameEn.toLowerCase().includes(q);
      const matchBn = d.nameBn ? d.nameBn.includes(q) : false;
      const matchDistrict = d.district.toLowerCase().includes(q);
      const matchDivision = d.division.toLowerCase().includes(q);
      return matchEn || matchBn || matchDistrict || matchDivision;
    });
  }, [query, destinations]);

  // Exact match check
  const exactMatch = useMemo(() => {
    if (!normalizedQuery) return null;
    const nq = normalizedQuery.toLowerCase();
    return destinations.find(
      (d) => d.nameEn.toLowerCase() === nq || (d.nameBn && d.nameBn.toLowerCase() === nq)
    );
  }, [normalizedQuery, destinations]);

  // Fuzzy match suggestion check (e.g. Sajek Vally -> Sajek Valley)
  const closeFuzzyMatch = useMemo(() => {
    if (!normalizedQuery || exactMatch || normalizedQuery.length < 3) return null;
    const nq = normalizedQuery.toLowerCase();

    for (const d of destinations) {
      const distEn = getLevenshteinDistance(nq, d.nameEn.toLowerCase());
      // Threshold 1-3 edits for close matches
      if (distEn > 0 && distEn <= 3 && Math.abs(nq.length - d.nameEn.length) <= 3) {
        return d;
      }
    }
    return null;
  }, [normalizedQuery, exactMatch, destinations]);

  const handleSelectExisting = (dest: Destination) => {
    setSelectedDestination(dest);
    setQuery(dest.nameEn);
    setIsOpen(false);
    onChange({
      slug: dest.slug,
      nameEn: dest.nameEn,
      nameBn: dest.nameBn,
      isCustom: false
    });
  };

  const handleSelectCustomNew = () => {
    if (!normalizedQuery) return;
    const customSlug = generateDestinationSlug(normalizedQuery);
    setSelectedDestination(null);
    setIsOpen(false);
    onChange({
      slug: customSlug,
      nameEn: normalizedQuery,
      isCustom: true
    });
  };

  return (
    <div ref={wrapperRef} className="relative space-y-1.5">
      <label className="text-xs font-bold text-slate-800 block">
        Where did you travel?
      </label>

      <div className="relative">
        <MapPin className="w-4 h-4 text-brand-purple absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 z-10" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedDestination(null);
          }}
          placeholder="Type any destination, city, village, beach, hill, or tourist place (e.g. Sajek, সিলেট, Kuakata)"
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple focus:bg-white transition-colors"
        />

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selectedDestination && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified Destination" />
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Fuzzy Duplicate Warning Banner */}
      {closeFuzzyMatch && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Did you mean <strong className="text-slate-900">{closeFuzzyMatch.nameEn}</strong>?
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectExisting(closeFuzzyMatch)}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shrink-0"
          >
            Use {closeFuzzyMatch.nameEn}
          </button>
        </div>
      )}

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-72 overflow-y-auto z-50 p-2 space-y-1 divide-y divide-slate-100 scrollbar-none animate-in fade-in duration-150">
          {filteredSuggestions.length > 0 && (
            <div className="space-y-1 pb-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Matching Destinations ({filteredSuggestions.length})
              </div>
              {filteredSuggestions.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelectExisting(dest)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors text-xs ${
                    selectedDestination?.id === dest.id
                      ? 'bg-brand-purple/10 text-brand-purple font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-900">{dest.nameEn}</span>
                      {dest.nameBn && (
                        <span className="ml-1.5 text-slate-500 font-normal">({dest.nameBn})</span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                    {dest.district}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Option to Add New Custom Destination */}
          {query.trim() && !exactMatch && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSelectCustomNew}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-brand-purple/5 hover:bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-bold text-xs text-left transition-colors"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>
                  Submit <strong className="text-slate-900 font-black">"{normalizedQuery}"</strong> as a new Bangladesh destination
                </span>
              </button>
              <p className="px-3 pt-1 text-[10px] text-slate-400">
                Newly submitted places will be marked pending review and published with your trip.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
