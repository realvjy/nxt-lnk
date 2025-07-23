import { useBuilderStore } from '@/store/useBuilderStore'

export default function BioBlock({ data, id, isEdit }: any) {
    const updateBlock = useBuilderStore((s) => s.updateBlock)

    if (isEdit) {
        return (
            <textarea
                value={data.text}
                onChange={(e) =>
                    updateBlock(id, {
                        id,
                        type: 'bio',
                        props: { ...data, text: e.target.value },
                    })
                }
                className="text-lg text-gray-600 w-full"
            />
        )
    }

    return <p className="text-lg text-gray-600">{data.text}</p>
}
