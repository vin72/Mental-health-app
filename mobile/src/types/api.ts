import { Category, PrimaryGoal, QuoteLength, Tone } from '@/constants/enums';

export type UserPreferences = {
  primary_goal: PrimaryGoal;
  tone: Tone;
  quote_length: QuoteLength;
  allow_spiritual: boolean;
};

export type GenerateQuoteRequest = {
  category: Category;
  mood: string;
  context?: string;
};

export type Quote = {
  id: string;
  quote_text: string;
  category: string;
  is_favorite: boolean;
  created_at: string;
};
