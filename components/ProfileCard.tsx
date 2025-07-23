import { Card } from "@/components/ui/card"
import {
    Twitter,
    Github,
    Instagram,
    Linkedin,
    Figma,
} from "lucide-react"

const socials = [
    { icon: Twitter, href: "https://twitter.com/realvjy" },
    { icon: Figma, href: "https://figma.com/@realvjy" },
    { icon: Instagram, href: "https://instagram.com/realvjy" },
    { icon: Linkedin, href: "https://linkedin.com/in/realvjy" },
    { icon: Github, href: "https://github.com/realvjy" },
]

export function ProfileCard() {
    return (
        <Card className="p-6 text-center rounded-2xl space-y-4">
            <div className="text-2xl font-semibold">vijay verma</div>
            <p className="text-muted-foreground text-sm leading-relaxed">
                A wizard who loves design and code. I tell stories through my designs and illustrations. I spend most of my time designing for brands and creating design resources and tools. And now, making my own game.
            </p>

            <hr className="my-4 border-muted" />

            <div className="flex justify-center flex-wrap gap-4">
                {socials.map(({ icon: Icon, href }, i) => (
                    <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition"
                    >
                        <Icon className="w-5 h-5" />
                    </a>
                ))}
            </div>
        </Card>
    )
}
