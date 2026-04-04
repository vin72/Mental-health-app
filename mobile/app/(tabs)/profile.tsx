import { Button, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return <Screen>
    <Text style={{ fontSize: 24, fontWeight: '600' }}>Profile</Text>
    <Text>Profile details are a TODO for the next iteration.</Text>
    <Button title="Sign out" onPress={async () => { await supabase.auth.signOut(); router.replace('/(auth)/login'); }} />
  </Screen>;
}
