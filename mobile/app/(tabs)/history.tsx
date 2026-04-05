import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { apiRequest } from '@/lib/api';
import { Quote } from '@/types/api';

export default function HistoryScreen() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    apiRequest<Quote[]>('/quotes/history').then(setQuotes).catch(() => setQuotes([]));
  }, []);

  return <Screen>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>History</Text>
    <FlatList data={quotes} keyExtractor={(q) => q.id} renderItem={({ item }) => (
      <View style={{ borderWidth: 1, padding: 12, marginBottom: 8 }}><Text>{item.quote_text}</Text></View>
    )} />
  </Screen>;
}
