import { create } from 'zustand';
import { Quote } from '@/types/api';

type QuoteState = {
  latestQuote: Quote | null;
  setLatestQuote: (quote: Quote | null) => void;
};

export const useQuoteStore = create<QuoteState>((set) => ({
  latestQuote: null,
  setLatestQuote: (latestQuote) => set({ latestQuote })
}));
