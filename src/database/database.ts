import SQLite from 'react-native-sqlite-storage';
import {Deck, Flashcard, StudySession} from '../types';

SQLite.enablePromise(true);

const DATABASE_NAME = 'memorymaster.db';
const DATABASE_VERSION = 1;

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createDecksTable = `
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        color TEXT NOT NULL,
        tags TEXT,
        totalCards INTEGER DEFAULT 0,
        newCards INTEGER DEFAULT 0,
        learningCards INTEGER DEFAULT 0,
        reviewCards INTEGER DEFAULT 0,
        masteredCards INTEGER DEFAULT 0,
        newCardsPerDay INTEGER DEFAULT 20,
        maxReviewsPerDay INTEGER DEFAULT 200,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        lastStudied TEXT
      );
    `;

    const createCardsTable = `
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        deckId TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        hint TEXT,
        tags TEXT,
        imageUrl TEXT,
        audioUrl TEXT,
        cardType TEXT NOT NULL,
        easeFactor REAL DEFAULT 2.5,
        interval INTEGER DEFAULT 0,
        repetitions INTEGER DEFAULT 0,
        dueDate TEXT NOT NULL,
        lastReviewed TEXT,
        state TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
      );
    `;

    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        deckId TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        cardsStudied INTEGER DEFAULT 0,
        newCardsLearned INTEGER DEFAULT 0,
        againCount INTEGER DEFAULT 0,
        hardCount INTEGER DEFAULT 0,
        goodCount INTEGER DEFAULT 0,
        easyCount INTEGER DEFAULT 0,
        duration INTEGER DEFAULT 0,
        xpEarned INTEGER DEFAULT 0,
        FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_cards_deckId ON cards (deckId);
      CREATE INDEX IF NOT EXISTS idx_cards_dueDate ON cards (dueDate);
      CREATE INDEX IF NOT EXISTS idx_cards_state ON cards (state);
      CREATE INDEX IF NOT EXISTS idx_sessions_deckId ON sessions (deckId);
      CREATE INDEX IF NOT EXISTS idx_sessions_startTime ON sessions (startTime);
    `;

    await this.db.executeSql(createDecksTable);
    await this.db.executeSql(createCardsTable);
    await this.db.executeSql(createSessionsTable);
    await this.db.executeSql(createIndexes);
  }

  // Deck operations
  async createDeck(deck: Deck): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO decks (
        id, name, description, icon, color, tags, newCardsPerDay, maxReviewsPerDay,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(query, [
      deck.id,
      deck.name,
      deck.description || null,
      deck.icon || null,
      deck.color,
      deck.tags ? JSON.stringify(deck.tags) : null,
      deck.newCardsPerDay,
      deck.maxReviewsPerDay,
      deck.createdAt.toISOString(),
      deck.updatedAt.toISOString(),
    ]);
  }

  async getAllDecks(): Promise<Deck[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM decks ORDER BY updatedAt DESC');
    const decks: Deck[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      decks.push(this.mapRowToDeck(row));
    }

    return decks;
  }

  async getDeck(id: string): Promise<Deck | null> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM decks WHERE id = ?', [id]);

    if (results.rows.length === 0) return null;

    return this.mapRowToDeck(results.rows.item(0));
  }

  async updateDeck(deck: Deck): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      UPDATE decks SET
        name = ?, description = ?, icon = ?, color = ?, tags = ?,
        newCardsPerDay = ?, maxReviewsPerDay = ?, updatedAt = ?
      WHERE id = ?
    `;

    await this.db.executeSql(query, [
      deck.name,
      deck.description || null,
      deck.icon || null,
      deck.color,
      deck.tags ? JSON.stringify(deck.tags) : null,
      deck.newCardsPerDay,
      deck.maxReviewsPerDay,
      new Date().toISOString(),
      deck.id,
    ]);
  }

  async deleteDeck(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql('DELETE FROM decks WHERE id = ?', [id]);
  }

  // Card operations
  async createCard(card: Flashcard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO cards (
        id, deckId, front, back, hint, tags, imageUrl, audioUrl, cardType,
        easeFactor, interval, repetitions, dueDate, state, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(query, [
      card.id,
      card.deckId,
      card.front,
      card.back,
      card.hint || null,
      card.tags ? JSON.stringify(card.tags) : null,
      card.imageUrl || null,
      card.audioUrl || null,
      card.cardType,
      card.easeFactor,
      card.interval,
      card.repetitions,
      card.dueDate.toISOString(),
      card.state,
      card.createdAt.toISOString(),
      card.updatedAt.toISOString(),
    ]);

    await this.updateDeckStats(card.deckId);
  }

  async getCardsByDeck(deckId: string): Promise<Flashcard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT * FROM cards WHERE deckId = ?', [deckId]);
    const cards: Flashcard[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      cards.push(this.mapRowToCard(results.rows.item(i)));
    }

    return cards;
  }

  async updateCard(card: Flashcard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      UPDATE cards SET
        front = ?, back = ?, hint = ?, tags = ?, imageUrl = ?, audioUrl = ?,
        cardType = ?, easeFactor = ?, interval = ?, repetitions = ?,
        dueDate = ?, lastReviewed = ?, state = ?, updatedAt = ?
      WHERE id = ?
    `;

    await this.db.executeSql(query, [
      card.front,
      card.back,
      card.hint || null,
      card.tags ? JSON.stringify(card.tags) : null,
      card.imageUrl || null,
      card.audioUrl || null,
      card.cardType,
      card.easeFactor,
      card.interval,
      card.repetitions,
      card.dueDate.toISOString(),
      card.lastReviewed ? card.lastReviewed.toISOString() : null,
      card.state,
      new Date().toISOString(),
      card.id,
    ]);

    await this.updateDeckStats(card.deckId);
  }

  async deleteCard(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql('SELECT deckId FROM cards WHERE id = ?', [id]);
    if (results.rows.length > 0) {
      const deckId = results.rows.item(0).deckId;
      await this.db.executeSql('DELETE FROM cards WHERE id = ?', [id]);
      await this.updateDeckStats(deckId);
    }
  }

  // Session operations
  async createSession(session: StudySession): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO sessions (
        id, deckId, startTime, endTime, cardsStudied, newCardsLearned,
        againCount, hardCount, goodCount, easyCount, duration, xpEarned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db.executeSql(query, [
      session.id,
      session.deckId,
      session.startTime.toISOString(),
      session.endTime ? session.endTime.toISOString() : null,
      session.cardsStudied,
      session.newCardsLearned,
      session.againCount,
      session.hardCount,
      session.goodCount,
      session.easyCount,
      session.duration,
      session.xpEarned,
    ]);
  }

  async getSessionsByDeck(deckId: string): Promise<StudySession[]> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      'SELECT * FROM sessions WHERE deckId = ? ORDER BY startTime DESC',
      [deckId],
    );
    const sessions: StudySession[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      sessions.push(this.mapRowToSession(results.rows.item(i)));
    }

    return sessions;
  }

  // Helper methods
  private async updateDeckStats(deckId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const [results] = await this.db.executeSql(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN state = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN state = 'learning' OR state = 'relearning' THEN 1 ELSE 0 END) as learning,
        SUM(CASE WHEN state = 'young' THEN 1 ELSE 0 END) as review,
        SUM(CASE WHEN state = 'mature' THEN 1 ELSE 0 END) as mastered
      FROM cards WHERE deckId = ?`,
      [deckId],
    );

    const stats = results.rows.item(0);

    await this.db.executeSql(
      `UPDATE decks SET
        totalCards = ?,
        newCards = ?,
        learningCards = ?,
        reviewCards = ?,
        masteredCards = ?,
        updatedAt = ?
      WHERE id = ?`,
      [
        stats.total,
        stats.new,
        stats.learning,
        stats.review,
        stats.mastered,
        new Date().toISOString(),
        deckId,
      ],
    );
  }

  private mapRowToDeck(row: any): Deck {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      tags: row.tags ? JSON.parse(row.tags) : [],
      totalCards: row.totalCards,
      newCards: row.newCards,
      learningCards: row.learningCards,
      reviewCards: row.reviewCards,
      masteredCards: row.masteredCards,
      newCardsPerDay: row.newCardsPerDay,
      maxReviewsPerDay: row.maxReviewsPerDay,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      lastStudied: row.lastStudied ? new Date(row.lastStudied) : undefined,
    };
  }

  private mapRowToCard(row: any): Flashcard {
    return {
      id: row.id,
      deckId: row.deckId,
      front: row.front,
      back: row.back,
      hint: row.hint,
      tags: row.tags ? JSON.parse(row.tags) : [],
      imageUrl: row.imageUrl,
      audioUrl: row.audioUrl,
      cardType: row.cardType,
      easeFactor: row.easeFactor,
      interval: row.interval,
      repetitions: row.repetitions,
      dueDate: new Date(row.dueDate),
      lastReviewed: row.lastReviewed ? new Date(row.lastReviewed) : undefined,
      state: row.state,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  private mapRowToSession(row: any): StudySession {
    return {
      id: row.id,
      deckId: row.deckId,
      startTime: new Date(row.startTime),
      endTime: row.endTime ? new Date(row.endTime) : undefined,
      cardsStudied: row.cardsStudied,
      newCardsLearned: row.newCardsLearned,
      againCount: row.againCount,
      hardCount: row.hardCount,
      goodCount: row.goodCount,
      easyCount: row.easyCount,
      duration: row.duration,
      xpEarned: row.xpEarned,
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const database = new Database();
