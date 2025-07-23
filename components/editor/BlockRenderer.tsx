// components/editor/BlockRenderer.tsx
'use client'

import { useBuilderStore } from '@store/useBuilderStore'
import NameBlock from '@components/blocks/NameBlock'
import BioBlock from '@components/blocks/BioBlock'
import LinkBlock from '@components/blocks/LinkBlock'
import type { Block } from '@shared/blocks'



export default function BlockRenderer({ layout }: { layout?: Block[] }) {
    const storeLayout = useBuilderStore((s) => s.layout)
    const updateBlock = useBuilderStore((s) => s.updateBlock)
    const blocks = layout || storeLayout

    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case 'name':
                    case 'bio':
                        return (
                            <input
                                key={i}
                                className="w-full border px-3 py-2 rounded"
                                value={block.props.text}
                                onChange={(e) =>
                                    updateBlock(i, {
                                        ...block,
                                        props: { ...block.props, text: e.target.value },
                                    })
                                }
                                placeholder={block.type === 'name' ? 'Your Name' : 'Your Bio'}
                            />
                        )

                    case 'link':
                        return (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-1/2 border px-2 py-1 rounded"
                                    value={block.props.label}
                                    onChange={(e) =>
                                        updateBlock(i, {
                                            ...block,
                                            props: { ...block.props, label: e.target.value },
                                        })
                                    }
                                    placeholder="Label"
                                />
                                <input
                                    className="w-1/2 border px-2 py-1 rounded"
                                    value={block.props.url}
                                    onChange={(e) =>
                                        updateBlock(i, {
                                            ...block,
                                            props: { ...block.props, url: e.target.value },
                                        })
                                    }
                                    placeholder="https://"
                                />
                            </div>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}