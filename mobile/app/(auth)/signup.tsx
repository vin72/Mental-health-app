import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormValues = z.infer<typeof schema>;

export default function SignUpScreen() {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { data, error } = await supabase.auth.signUp(values);
    if (!error && data.session) router.replace('/(tabs)/home');
  };

  register('email');
  register('password');

  return <Screen>
    <Text style={{ fontSize: 26, fontWeight: '600' }}>Sign up</Text>
    <TextInput placeholder="Email" autoCapitalize="none" onChangeText={(v) => setValue('email', v)} style={{ borderWidth: 1, padding: 12 }} />
    {errors.email && <Text>{errors.email.message}</Text>}
    <TextInput placeholder="Password" secureTextEntry onChangeText={(v) => setValue('password', v)} style={{ borderWidth: 1, padding: 12 }} />
    {errors.password && <Text>{errors.password.message}</Text>}
    <Button title="Create account" onPress={handleSubmit(onSubmit)} />
    <View style={{ flexDirection: 'row', gap: 4 }}><Text>Already registered?</Text><Link href="/(auth)/login">Log in</Link></View>
  </Screen>;
}
