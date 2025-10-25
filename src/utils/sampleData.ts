import {Deck, Flashcard} from '../types';
import {database} from '../database/database';
import {initializeCard} from '../algorithms/spacedRepetition';

/**
 * Sample data for testing and demonstration
 */

export const createSampleDeck = async (): Promise<void> => {
  const sampleDeck: Deck = {
    id: `deck-${Date.now()}`,
    name: 'Spanish Vocabulary',
    description: 'Common Spanish words and phrases for beginners',
    color: '#667EEA',
    tags: ['languages', 'spanish', 'beginner'],
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

  await database.createDeck(sampleDeck);

  const sampleCards = [
    {front: 'Hello', back: 'Hola', hint: 'Common greeting'},
    {front: 'Goodbye', back: 'Adiós', hint: 'Farewell'},
    {front: 'Thank you', back: 'Gracias', hint: 'Expression of gratitude'},
    {front: 'Please', back: 'Por favor', hint: 'Polite request'},
    {front: 'Yes', back: 'Sí', hint: 'Affirmative'},
    {front: 'No', back: 'No', hint: 'Negative'},
    {front: 'Good morning', back: 'Buenos días', hint: 'Morning greeting'},
    {front: 'Good night', back: 'Buenas noches', hint: 'Evening greeting'},
    {front: 'How are you?', back: '¿Cómo estás?', hint: 'Common question'},
    {front: 'My name is...', back: 'Me llamo...', hint: 'Introduction'},
    {front: 'Water', back: 'Agua', hint: 'Essential drink'},
    {front: 'Food', back: 'Comida', hint: 'Nourishment'},
    {front: 'House', back: 'Casa', hint: 'Place to live'},
    {front: 'Family', back: 'Familia', hint: 'Relatives'},
    {front: 'Friend', back: 'Amigo', hint: 'Companion'},
    {front: 'Love', back: 'Amor', hint: 'Strong affection'},
    {front: 'Time', back: 'Tiempo', hint: 'Duration'},
    {front: 'Day', back: 'Día', hint: '24 hours'},
    {front: 'Night', back: 'Noche', hint: 'Dark period'},
    {front: 'Sun', back: 'Sol', hint: 'Star in our solar system'},
  ];

  for (const cardData of sampleCards) {
    const card = initializeCard({
      deckId: sampleDeck.id,
      front: cardData.front,
      back: cardData.back,
      hint: cardData.hint,
      tags: ['vocabulary'],
    });

    await database.createCard(card);
  }

  console.log('Sample deck created successfully');
};

export const createProgrammingDeck = async (): Promise<void> => {
  const programmingDeck: Deck = {
    id: `deck-${Date.now()}`,
    name: 'JavaScript Basics',
    description: 'Essential JavaScript concepts and syntax',
    color: '#F56565',
    tags: ['programming', 'javascript', 'web'],
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

  await database.createDeck(programmingDeck);

  const jsCards = [
    {
      front: 'What is a variable?',
      back: 'A container for storing data values',
      hint: 'let, const, var',
    },
    {
      front: 'What is a function?',
      back: 'A reusable block of code that performs a specific task',
      hint: 'function keyword',
    },
    {
      front: 'What is an array?',
      back: 'A data structure that stores multiple values in a single variable',
      hint: 'Use [] brackets',
    },
    {
      front: 'What is an object?',
      back: 'A collection of key-value pairs',
      hint: 'Use {} curly braces',
    },
    {
      front: 'What is a loop?',
      back: 'A control structure that repeats a block of code',
      hint: 'for, while, forEach',
    },
    {
      front: 'What is a callback?',
      back: 'A function passed as an argument to another function',
      hint: 'Higher-order functions',
    },
    {
      front: 'What is a promise?',
      back: 'An object representing the eventual completion or failure of an async operation',
      hint: 'then, catch, finally',
    },
    {
      front: 'What is async/await?',
      back: 'Syntactic sugar for working with promises in a synchronous manner',
      hint: 'Cleaner async code',
    },
    {
      front: 'What is the spread operator?',
      back: 'Syntax (...) that expands an iterable into individual elements',
      hint: 'Three dots',
    },
    {
      front: 'What is destructuring?',
      back: 'A way to extract values from arrays or objects into variables',
      hint: 'Pattern matching',
    },
  ];

  for (const cardData of jsCards) {
    const card = initializeCard({
      deckId: programmingDeck.id,
      front: cardData.front,
      back: cardData.back,
      hint: cardData.hint,
      tags: ['javascript', 'concepts'],
    });

    await database.createCard(card);
  }

  console.log('Programming deck created successfully');
};

export const seedSampleData = async (): Promise<void> => {
  try {
    await createSampleDeck();
    await createProgrammingDeck();
    console.log('All sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
};
