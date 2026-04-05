import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function scheduleDailyReminder(enabled: boolean) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily reminder',
      body: 'Generate today\'s motivational quote.'
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.DAILY
    }
  });
}
