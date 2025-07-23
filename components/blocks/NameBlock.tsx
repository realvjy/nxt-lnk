// components/blocks/NameBlock.tsx
type Props = {
    text: string
}

export default function NameBlock({ text }: Props) {
    return <h1 className="text-3xl font-bold">{text}</h1>
}
