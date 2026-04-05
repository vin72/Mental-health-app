export const PRIMARY_GOALS = ['fitness', 'career', 'discipline', 'healing', 'confidence', 'study'] as const;
export const TONES = ['calm', 'intense', 'spiritual', 'practical', 'stoic'] as const;
export const QUOTE_LENGTHS = ['short', 'medium'] as const;
export const CATEGORIES = ['discipline', 'healing', 'fitness', 'career', 'grief', 'study', 'loneliness', 'self-respect', 'resilience'] as const;

export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];
export type Tone = (typeof TONES)[number];
export type QuoteLength = (typeof QUOTE_LENGTHS)[number];
export type Category = (typeof CATEGORIES)[number];
