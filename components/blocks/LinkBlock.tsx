import { useBuilderStore } from '@/store/useBuilderStore'

export default function LinkBlock({ data, id, isEdit }: { data: any; id: string; isEdit?: boolean }) {
    const updateBlock = useBuilderStore((s) => s.updateBlock)

    if (isEdit) {
        return (
            <div className="space-y-2">
                <input
                    value={data.label}
                    onChange={(e) =>
                        updateBlock(id, {
                            id,
                            type: 'link',
                            props: { ...data, label: e.target.value },
                        })
                    }
                    className="w-full border px-2 py-1"
                    placeholder="Label"
                />
                <input
                    value={data.url}
                    onChange={(e) =>
                        updateBlock(id, {
                            id,
                            type: 'link',
                            props: { ...data, url: e.target.value },
                        })
                    }
                    className="w-full border px-2 py-1"
                    placeholder="URL"
                />
            </div>
        )
    }

    return (
        <a href={data.url} target="_blank" className="block text-blue-600 underline">
            {data.label}
        </a>
    )
}
