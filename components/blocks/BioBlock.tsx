import { useLayoutStore } from '@/store/layoutStore'
import { BioBlockType } from '@/shared/blocks'

export default function BioBlock({ block, isEdit }: { block: BioBlockType; isEdit?: boolean }) {
    const updateBlock = useLayoutStore((s) => s.updateBlock)

    if (isEdit) {
        return (
            <textarea
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
                className="text-lg text-gray-600 w-full"
                placeholder="Write something about yourself"
            />
        )
    }

    return <p className="text-lg text-gray-600">{block.props.text}</p>
}
