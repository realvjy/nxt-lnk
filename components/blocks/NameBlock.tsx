import { useBuilderStore } from '@/store/useBuilderStore'

export default function NameBlock({ data, id, isEdit }: { data: any; id: string; isEdit?: boolean }) {
    const updateBlock = useBuilderStore((s) => s.updateBlock)

    if (isEdit) {
        return (
            <input
                value={data.text}
                onChange={(e) =>
                    updateBlock(id, {
                        id,
                        type: 'name',
                        props: { text: e.target.value },
                    })
                }
                className="text-3xl font-bold w-full"
            />
        )
    }

    return <h1 className="text-3xl font-bold">{data.text}</h1>
}
