// components/blocks/BioBlock.tsx
type Props = {
    text: string
}

export default function BioBlock({ text }: Props) {
    return <p className="text-gray-600 text-lg">{text}</p>
}
