import { useBuilderStore } from '@/store/useBuilderStore'
import { NameBlockType } from '@/shared/blocks'

export default function NameBlock({ block, isEdit }: { block: NameBlockType; isEdit?: boolean }) {
    const updateBlock = useBuilderStore((s) => s.updateBlock)

    if (isEdit) {
        return (
            <input
                value={block.props.text}
                onChange={(e) =>
                    updateBlock(block.id, {
                        ...block,
                        props: {
                            ...block.props,
                            text: e.target.value
                        }
                    })
                }
                className="text-3xl font-bold w-full"
                placeholder="Enter your name"
            />
        )
    }

    return <h1 className="text-3xl font-bold">{block.props.text}</h1>
}
