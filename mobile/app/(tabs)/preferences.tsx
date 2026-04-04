import { useEffect, useState } from 'react';
import { Button, Switch, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PRIMARY_GOALS, QUOTE_LENGTHS, TONES } from '@/constants/enums';
import { apiRequest } from '@/lib/api';
import { requestNotificationPermission, scheduleDailyReminder } from '@/lib/notifications';
import { UserPreferences } from '@/types/api';

const defaultPrefs: UserPreferences = { primary_goal: 'discipline', tone: 'practical', quote_length: 'short', allow_spiritual: false };

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPrefs);
  const [dailyReminder, setDailyReminder] = useState(false);

  useEffect(() => {
    apiRequest<{ preferences: UserPreferences }>('/me').then((r) => r.preferences && setPrefs(r.preferences)).catch(() => undefined);
  }, []);

  const save = async () => {
    await apiRequest('/me/preferences', { method: 'PUT', body: JSON.stringify(prefs) });
  };

  const toggleReminder = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    await scheduleDailyReminder(enabled);
    setDailyReminder(enabled);
  };

  return <Screen>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>Preferences</Text>
    <Text>Primary goal</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{PRIMARY_GOALS.map((v) => <Button key={v} title={v} onPress={() => setPrefs({ ...prefs, primary_goal: v })} />)}</View>
    <Text>Tone</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{TONES.map((v) => <Button key={v} title={v} onPress={() => setPrefs({ ...prefs, tone: v })} />)}</View>
    <Text>Quote length</Text>
    <View style={{ flexDirection: 'row', gap: 6 }}>{QUOTE_LENGTHS.map((v) => <Button key={v} title={v} onPress={() => setPrefs({ ...prefs, quote_length: v })} />)}</View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text>Allow spiritual content</Text><Switch value={prefs.allow_spiritual} onValueChange={(v) => setPrefs({ ...prefs, allow_spiritual: v })} />
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text>Daily reminder</Text><Switch value={dailyReminder} onValueChange={toggleReminder} />
    </View>
    <Button title="Save" onPress={save} />
  </Screen>;
}
