// components/CardList.tsx
'use client'

import { useCardStore } from '@/lib/stores/useCardStore'
import { ArrowUpRight } from 'lucide-react'

export default function CardList() {
    const { cards } = useCardStore()

    return (
        <div className="mt-6 space-y-4">
            {cards.map((card) => (
                <a
                    key={card.id}
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-white shadow dark:bg-neutral-800"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{card.icon || '🔗'}</span>
                        <span className="font-medium">{card.title}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4" />
                </a>
            ))}
        </div>
    )
}
