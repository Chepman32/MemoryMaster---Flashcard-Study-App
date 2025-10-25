import React from 'react';
import {View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity} from 'react-native';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';

export const SettingsScreen: React.FC = () => {
  const {settings, updateSettings} = useStore();
  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  const SettingRow = ({
    label,
    value,
    onToggle,
    type = 'switch',
  }: {
    label: string;
    value: any;
    onToggle?: () => void;
    type?: 'switch' | 'button';
  }) => (
    <View style={[styles.settingRow, {borderBottomColor: theme.border}]}>
      <Text style={[styles.settingLabel, {color: theme.textPrimary}]}>{label}</Text>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{false: theme.border, true: theme.primary}}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.textPrimary}, Typography.h2]}>Settings</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}, Typography.h4]}>
            Appearance
          </Text>
          <View style={[styles.sectionContent, {backgroundColor: theme.surface}]}>
            <SettingRow
              label="Dark Mode"
              value={settings.theme === 'dark'}
              onToggle={() =>
                updateSettings({theme: settings.theme === 'dark' ? 'light' : 'dark'})
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}, Typography.h4]}>
            Study Settings
          </Text>
          <View style={[styles.sectionContent, {backgroundColor: theme.surface}]}>
            <SettingRow
              label="Show Timer"
              value={settings.showTimer}
              onToggle={() => updateSettings({showTimer: !settings.showTimer})}
            />
            <SettingRow
              label="Swipe Gestures"
              value={settings.swipeGestures}
              onToggle={() => updateSettings({swipeGestures: !settings.swipeGestures})}
            />
            <SettingRow
              label="Haptic Feedback"
              value={settings.hapticFeedback}
              onToggle={() => updateSettings({hapticFeedback: !settings.hapticFeedback})}
            />
            <SettingRow
              label="Sound Effects"
              value={settings.soundEffects}
              onToggle={() => updateSettings({soundEffects: !settings.soundEffects})}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}, Typography.h4]}>
            Notifications
          </Text>
          <View style={[styles.sectionContent, {backgroundColor: theme.surface}]}>
            <SettingRow
              label="Study Reminders"
              value={settings.studyReminders}
              onToggle={() => updateSettings({studyReminders: !settings.studyReminders})}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.textSecondary}, Typography.h4]}>
            About
          </Text>
          <View style={[styles.sectionContent, {backgroundColor: theme.surface}]}>
            <View style={[styles.settingRow, {borderBottomWidth: 0}]}>
              <Text style={[styles.settingLabel, {color: theme.textPrimary}]}>Version</Text>
              <Text style={[styles.settingValue, {color: theme.textSecondary}]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {},
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
});
