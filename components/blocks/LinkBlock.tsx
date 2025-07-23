// components/blocks/LinkBlock.tsx
type Props = {
    label: string
    url: string
    icon?: string // optional: for future icon support
}

export default function LinkBlock({ label, url }: Props) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 mt-2 rounded bg-blue-600 text-white text-center hover:bg-blue-700 transition"
        >
            {label}
        </a>
    )
}
