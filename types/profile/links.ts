// Link type definitions

import { LinkType, SocialLink, BlogLink, NormalLink } from "../app/links"

/**
 * Union type for all link types
 */
export type Link = SocialLink | BlogLink | NormalLink

/**
 * Collection of links for a user
 */
export interface LinksCollection {
    userId: string
    links: Link[]
}