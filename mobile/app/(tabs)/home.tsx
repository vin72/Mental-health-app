import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { CATEGORIES } from '@/constants/enums';
import { apiRequest } from '@/lib/api';
import { useQuoteStore } from '@/store/quote-store';
import { Quote } from '@/types/api';

export default function HomeScreen() {
  const [mood, setMood] = useState('Focused');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('discipline');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latestQuote, setLatestQuote } = useQuoteStore();

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const quote = await apiRequest<Quote>('/quotes/generate', {
        method: 'POST',
        body: JSON.stringify({ mood, category, context })
      });
      setLatestQuote(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!latestQuote) return;
    await apiRequest(`/quotes/${latestQuote.id}/favorite`, { method: 'POST' });
    setLatestQuote({ ...latestQuote, is_favorite: true });
  };

  return <Screen>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>How are you feeling?</Text>
    <TextInput value={mood} onChangeText={setMood} style={{ borderWidth: 1, padding: 12 }} />
    <Text>What do you need motivation for?</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {CATEGORIES.map((c) => <Button key={c} title={c} onPress={() => setCategory(c)} color={category === c ? '#0a7' : '#888'} />)}
    </View>
    <Text>Optional context</Text>
    <TextInput value={context} onChangeText={setContext} multiline style={{ borderWidth: 1, minHeight: 80, padding: 12 }} />
    <Button title={loading ? 'Generating...' : 'Generate quote'} disabled={loading} onPress={generate} />
    {error && <Text style={{ color: 'red' }}>{error}</Text>}
    {latestQuote && (
      <View style={{ borderWidth: 1, padding: 12, gap: 8 }}>
        <Text style={{ fontStyle: 'italic' }}>{latestQuote.quote_text}</Text>
        <Button title={latestQuote.is_favorite ? 'Saved' : 'Save'} onPress={save} disabled={latestQuote.is_favorite} />
      </View>
    )}
  </Screen>;
}
