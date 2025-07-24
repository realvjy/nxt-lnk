// lib/constants/blockTypes.ts
import { LucideIcon, Heading, Quote, Link, List, User, Image, Tag, Badge } from "lucide-react";

// Define the union type for all possible block types
export type BlockType = "name" | "bio" | "link" | "tagline" | "image" | "badge";

export interface BlockTypeConfig {
    type: BlockType;  // Change this from string to BlockType
    label: string;
    icon: LucideIcon;
    description: string;
}

export const BLOCK_TYPES: BlockTypeConfig[] = [
    {
        type: "name",  // Changed from "heading" to "name" to match BlockType
        label: "Name",
        icon: Heading,
        description: "Add your name"
    },
    {
        type: "bio",
        label: "Bio",
        icon: User,
        description: "Rich text bio section"
    },
    {
        type: "link",
        label: "Link",
        icon: Link,
        description: "Add a custom link"
    },
    {
        type: "tagline",  // Changed from "list" to "tagline"
        label: "Tagline",
        icon: Tag,
        description: "Add a tagline"
    },
    {
        type: "image",  // Changed from "quote" to "image"
        label: "Image",
        icon: Image,
        description: "Add an image"
    },
    {
        type: "badge",
        label: "Badge",
        icon: Badge,
        description: "Add a badge"
    }
];