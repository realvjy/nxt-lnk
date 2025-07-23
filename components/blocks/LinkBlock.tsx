import { useLayoutStore } from '@/store/layoutStore'
import { LinkBlockType } from '@/shared/blocks'
export default function LinkBlock({ block, isEdit }: { block: LinkBlockType; isEdit?: boolean }) {
    const updateBlock = useLayoutStore((s) => s.updateBlock)

    const { label, url } = block.props

    if (isEdit) {
        return (
            <div className="space-y-2">
                <input
                    value={label}
                    onChange={(e) =>
                        updateBlock(block.id, {
                            ...block,
                            props: {
                                ...block.props,
                                label: e.target.value,
                            },
                        })
                    }
                    className="w-full border px-2 py-1"
                    placeholder="Label"
                />
                <input
                    value={url}
                    onChange={(e) =>
                        updateBlock(block.id, {
                            ...block,
                            props: {
                                ...block.props,
                                url: e.target.value,
                            },
                        })
                    }
                    className="w-full border px-2 py-1"
                    placeholder="URL"
                />
            </div>
        )
    }

    return (
        <a href={url} target="_blank" className="block text-blue-600 underline">
            {label}
        </a>
    )
}
