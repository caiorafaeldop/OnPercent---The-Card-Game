import { Collectible } from '../types';
import { HISTORIA_DA_NOITE_COLLECTION } from './cards/master_collection';

export const GACHA_COST = 100;
export const BONUS_CREDITS = 33;

export const COLLECTIBLES: Collectible[] = [
  ...HISTORIA_DA_NOITE_COLLECTION
];

export const getAllCollectibles = (customCards: Collectible[] = []): Collectible[] => [
  ...COLLECTIBLES,
  ...customCards
];

export const pullGacha = (cards: Collectible[] = COLLECTIBLES): Collectible => {
  const rand = Math.random();
  let pool: Collectible[] = [];

  // Probabilities:
  // Legendary: 5% (0.95 - 1.0)
  // Epic: 15% (0.80 - 0.95)
  // Rare: 30% (0.50 - 0.80)
  // Common: 50% (0.00 - 0.50)

  if (rand < 0.50) {
    pool = cards.filter(c => c.rarity === 'common');
  } else if (rand < 0.80) {
    pool = cards.filter(c => c.rarity === 'rare');
  } else if (rand < 0.95) {
    pool = cards.filter(c => c.rarity === 'epic');
    if (pool.length === 0) pool = cards.filter(c => c.rarity === 'rare');
  } else {
    pool = cards.filter(c => c.rarity === 'legendary');
    if (pool.length === 0) pool = cards.filter(c => c.rarity === 'epic');
  }

  // Fallback safe
  if (pool.length === 0) {
    pool = cards.filter(c => c.rarity === 'common');
  }

  if (pool.length === 0) {
    pool = cards;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};
