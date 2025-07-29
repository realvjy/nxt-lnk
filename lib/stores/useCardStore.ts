import { create } from 'zustand'
import { LinkCard } from '@/types/card'
import { nanoid } from 'nanoid'

interface CardState {
    cards: LinkCard[];
    addCard: (card: Omit<LinkCard, 'id'>) => void;
    removeCard: (id: string) => void;
}

export const useCardStore = create<CardState>((set) => ({
    cards: [],
    addCard: (card) =>
        set((state) => ({
            cards: [...state.cards, { ...card, id: nanoid() }],
        })),
    removeCard: (id) =>
        set((state) => ({
            cards: state.cards.filter((card) => card.id !== id),
        })),
}))
