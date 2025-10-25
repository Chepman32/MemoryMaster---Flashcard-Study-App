import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {database} from '../../database/database';
import {initializeCard} from '../../algorithms/spacedRepetition';
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Flashcard} from '../../types';

export const CardEditorScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {deckId, cardId, mode} = route.params as {
    deckId: string;
    cardId?: string;
    mode: 'create' | 'edit';
  };
  const {settings} = useStore();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    if (mode === 'edit' && cardId) {
      loadCard();
    }
  }, [cardId, mode]);

  const loadCard = async () => {
    try {
      const cards = await database.getCardsByDeck(deckId);
      const card = cards.find(c => c.id === cardId);
      if (card) {
        setFront(card.front);
        setBack(card.back);
        setHint(card.hint || '');
      }
    } catch (error) {
      console.error('Error loading card:', error);
    }
  };

  const saveCard = async () => {
    if (!front.trim() || !back.trim()) {
      alert('Please fill in both front and back fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        const newCard = initializeCard({
          deckId,
          front: front.trim(),
          back: back.trim(),
          hint: hint.trim() || undefined,
        });
        await database.createCard(newCard);
      } else if (cardId) {
        const cards = await database.getCardsByDeck(deckId);
        const existingCard = cards.find(c => c.id === cardId);
        if (existingCard) {
          const updatedCard: Flashcard = {
            ...existingCard,
            front: front.trim(),
            back: back.trim(),
            hint: hint.trim() || undefined,
            updatedAt: new Date(),
          };
          await database.updateCard(updatedCard);
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={cancel}>
          <Text style={[styles.cancelButton, {color: theme.textSecondary}]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.textPrimary}, Typography.h3]}>
          {mode === 'create' ? 'New Card' : 'Edit Card'}
        </Text>
        <TouchableOpacity onPress={saveCard} disabled={loading}>
          <Text style={[styles.saveButton, {color: theme.primary}]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Front Side */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>Front</Text>
          <TextInput
            style={[
              styles.input,
              styles.largeInput,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            value={front}
            onChangeText={setFront}
            placeholder="Enter the question or prompt"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Back Side */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>Back</Text>
          <TextInput
            style={[
              styles.input,
              styles.largeInput,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            value={back}
            onChangeText={setBack}
            placeholder="Enter the answer"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Hint (Optional) */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>
            Hint (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            value={hint}
            onChangeText={setHint}
            placeholder="Enter a hint to help remember"
            placeholderTextColor={theme.textSecondary}
            multiline
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl,
  },
  cancelButton: {
    fontSize: 16,
  },
  title: {},
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 60,
  },
  largeInput: {
    minHeight: 120,
  },
});
