'use client'

import { Block } from '@shared/blocks'
import { useBuilderStore } from '@store/useBuilderStore'
import { useState } from 'react'
import { Input } from '@ui/input'
import { Button } from '@ui/button'

export default function SlashMenu() {
    const addBlock = useBuilderStore((s) => s.addBlock)
    const [visible, setVisible] = useState(false)

    type BlockType = 'name' | 'bio' | 'link'
    const types: BlockType[] = ['name', 'bio', 'link']

    const handleInsert = (type: BlockType) => {
        const blockMap: Record<BlockType, Block> = {
            name: { type: 'name', props: { text: 'Your Name' } },
            bio: { type: 'bio', props: { text: 'Bio here...' } },
            link: { type: 'link', props: { label: 'GitHub', url: 'https://github.com' } },
        }

        addBlock(blockMap[type])
        setVisible(false)
    }

    return (
        <div className="space-y-2">
            <Input
                placeholder="Type / to insert"
                onKeyDown={(e) => {
                    if (e.key === '/') {
                        e.preventDefault()
                        setVisible(true)
                    }
                }}
            />
            {visible && (
                <div className="bg-white border rounded-md shadow w-full max-w-sm p-2 space-y-1">
                    {types.map((type) => (
                        <Button
                            key={type}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleInsert(type)}
                        >
                            ➕ Add {type}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
