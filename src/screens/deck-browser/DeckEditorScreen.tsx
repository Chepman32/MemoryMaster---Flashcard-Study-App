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
import {useStore} from '../../store/useStore';
import {LightTheme, DarkTheme, Typography, Spacing, BorderRadius} from '../../constants/theme';
import {Deck} from '../../types';

const DECK_COLORS = [
  '#667EEA',
  '#F56565',
  '#48BB78',
  '#ED8936',
  '#4299E1',
  '#9F7AEA',
  '#38B2AC',
  '#F687B3',
];

export const DeckEditorScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {deckId, mode} = (route.params as {deckId?: string; mode: 'create' | 'edit'}) || {
    mode: 'create',
  };
  const {settings, addDeck, updateDeck} = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(DECK_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const theme = settings.theme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    if (mode === 'edit' && deckId) {
      loadDeck();
    }
  }, [deckId, mode]);

  const loadDeck = async () => {
    try {
      const deck = await database.getDeck(deckId!);
      if (deck) {
        setName(deck.name);
        setDescription(deck.description || '');
        setSelectedColor(deck.color);
      }
    } catch (error) {
      console.error('Error loading deck:', error);
    }
  };

  const saveDeck = async () => {
    if (!name.trim()) {
      alert('Please enter a deck name');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        const newDeck: Deck = {
          id: `deck-${Date.now()}`,
          name: name.trim(),
          description: description.trim() || undefined,
          color: selectedColor,
          tags: [],
          totalCards: 0,
          newCards: 0,
          learningCards: 0,
          reviewCards: 0,
          masteredCards: 0,
          newCardsPerDay: 20,
          maxReviewsPerDay: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await database.createDeck(newDeck);
        addDeck(newDeck);
      } else if (deckId) {
        const existingDeck = await database.getDeck(deckId);
        if (existingDeck) {
          const updatedDeckData: Deck = {
            ...existingDeck,
            name: name.trim(),
            description: description.trim() || undefined,
            color: selectedColor,
            updatedAt: new Date(),
          };
          await database.updateDeck(updatedDeckData);
          updateDeck(updatedDeckData);
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving deck:', error);
      alert('Failed to save deck');
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
          {mode === 'create' ? 'New Deck' : 'Edit Deck'}
        </Text>
        <TouchableOpacity onPress={saveDeck} disabled={loading}>
          <Text style={[styles.saveButton, {color: theme.primary}]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Deck Name */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>
            Deck Name
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
            value={name}
            onChangeText={setName}
            placeholder="Enter deck name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>
            Description (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter deck description"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Color Picker */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: theme.textPrimary}, Typography.h4]}>Color</Text>
          <View style={styles.colorPicker}>
            {DECK_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {backgroundColor: color},
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
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
  },
  textArea: {
    minHeight: 100,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
