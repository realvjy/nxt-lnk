import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Props = {
    href: string
    label: string
    icon?: string
    highlight?: boolean
}

export function LinkCard({ href, label, icon, highlight }: Props) {
    return (
        <Link href={href} target="_blank" className="block">
            <Card
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all hover:bg-muted ${highlight ? "bg-yellow-100/80 text-yellow-800" : ""
                    }`}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <Image
                            src={icon}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )}
                    <span className="font-medium">{label}</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
            </Card>
        </Link>
    )
}
