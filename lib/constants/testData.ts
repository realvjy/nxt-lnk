import { SocialLink, BlogLink, NormalLink, Link } from '@/types/app/links'
import { Block, profileToBlocks, linksToBlocks } from '@/types/app/blocks'
import { UserPreferences } from '@/types/app/preferences'
import { LayoutConfig, UserProfile } from '@/types/index'
import { LinksCollection } from '@/types/profile/links'

/**
 * Mock user profiles for testing
 */
export const testUserProfiles: UserProfile[] = [
    {
        username: 'Rihana',
        fullName: 'Cool Verma',
        bio: '<p>Designer, illustrator, and creator of useful design resources. Currently building <a href="https://www.figma.com/community/plugin/1056467900248561542/Blush---Illustrations-for-everyone" target="_blank">Blush</a> and <a href="https://www.figma.com/community/plugin/1159123856358409147/Artify---Illustrations-for-everyone" target="_blank">Artify</a>.</p>',
        tagline: 'Designer & Illustrator',
        image: {
            url: 'https://randomuser.me/api/portraits/women/44.jpg',
            alt: 'Vijay Verma'
        },
        badge: 'available',
        createdAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-07-20T14:45:00Z'
    },
    {
        username: 'janedoe',
        fullName: 'Jane Doe',
        bio: '<p>Full-stack developer specializing in React and Node.js. Building tools that make developers more productive.</p>',
        tagline: 'Full-stack Developer',
        image: {
            url: 'https://randomuser.me/api/portraits/women/44.jpg',
            alt: 'Jane Doe'
        },
        badge: 'busy',
        createdAt: '2023-02-10T08:20:00Z',
        updatedAt: '2023-07-18T11:30:00Z'
    },
    {
        username: 'johndoe',
        fullName: 'John Doe',
        bio: '<p>Product designer with a passion for creating intuitive user experiences. Currently working on a new design system.</p>',
        tagline: 'Product Designer',
        image: {
            url: 'https://randomuser.me/api/portraits/men/32.jpg',
            alt: 'John Doe'
        },
        badge: 'live',
        createdAt: '2023-03-05T15:45:00Z',
        updatedAt: '2023-07-15T09:20:00Z'
    }
]

/**
 * Mock social media links
 */
export const mockSocialLinks: SocialLink[] = [
    {
        id: 'social_1',
        label: 'Twitter',
        url: 'https://twitter.com/realvjy',
        type: 'social',
        profileId: 'realvjy',
        title: 'Twitter',
        platform: 'twitter',
        icon: 'twitter',
        sortOrder: 1,
        isActive: true,
        createdAt: '2023-01-15T10:35:00Z',
        updatedAt: '2023-01-15T10:35:00Z'
    },
    {
        id: 'social_2',
        label: 'Instagram',
        url: 'https://instagram.com/realvjy',
        type: 'social',
        profileId: 'realvjy',
        title: 'Instagram',
        platform: 'instagram',
        icon: 'instagram',
        sortOrder: 2,
        isActive: true,
        createdAt: '2023-01-15T10:36:00Z',
        updatedAt: '2023-01-15T10:36:00Z'
    },
    {
        id: 'social_3',
        label: 'GitHub',
        url: 'https://github.com/realvjy',
        type: 'social',
        profileId: 'realvjy',
        title: 'GitHub',
        platform: 'github',
        icon: 'github',
        sortOrder: 3,
        isActive: true,
        createdAt: '2023-01-15T10:37:00Z',
        updatedAt: '2023-01-15T10:37:00Z'
    },
    {
        id: 'social_4',
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/realvjy',
        type: 'social',
        profileId: 'realvjy',
        title: 'LinkedIn',
        platform: 'linkedin',
        icon: 'linkedin',
        sortOrder: 4,
        isActive: true,
        createdAt: '2023-01-15T10:38:00Z',
        updatedAt: '2023-01-15T10:38:00Z'
    },
    {
        id: 'social_5',
        label: 'Dribbble',
        url: 'https://dribbble.com/realvjy',
        type: 'social',
        profileId: 'realvjy',
        title: 'Dribbble',
        platform: 'dribbble',
        icon: 'dribbble',
        sortOrder: 5,
        isActive: true,
        createdAt: '2023-01-15T10:39:00Z',
        updatedAt: '2023-01-15T10:39:00Z'
    }
]

/**
 * Mock blog links
 */
export const mockBlogLinks: BlogLink[] = [
    {
        id: 'blog_1',
        label: 'How I designed the new Blush plugin',
        url: 'https://medium.com/@realvjy/how-i-designed-the-new-blush-plugin',
        type: 'blog',
        description: 'A deep dive into the design process behind the Blush plugin for Figma.',
        publishDate: '2023-06-15T00:00:00Z',
        cover: 'https://miro.medium.com/max/1400/1*6ahbWjp_g9hqhaTDSJOL1Q.png',
        profileId: 'realvjy',
        title: 'How I designed the new Blush plugin',
        sortOrder: 1,
        isActive: true,
        createdAt: '2023-06-15T10:00:00Z',
        updatedAt: '2023-06-15T10:00:00Z'
    },
    {
        id: 'blog_2',
        label: 'Creating consistent illustrations for your product',
        url: 'https://medium.com/@realvjy/creating-consistent-illustrations',
        type: 'blog',
        description: 'Tips and tricks for maintaining consistency in your product illustrations.',
        publishDate: '2023-05-10T00:00:00Z',
        cover: 'https://miro.medium.com/max/1400/1*8KGyj4RNxNTNveRy9mJHtA.png',
        profileId: 'realvjy',
        title: 'Creating consistent illustrations for your product',
        sortOrder: 2,
        isActive: true,
        createdAt: '2023-05-10T09:30:00Z',
        updatedAt: '2023-05-10T09:30:00Z'
    }
]

/**
 * Mock normal links
 */
export const mockNormalLinks: NormalLink[] = [
    {
        id: 'link_1',
        label: 'My Portfolio',
        url: 'https://realvjy.com',
        type: 'normal',
        icon: 'globe',
        profileId: 'realvjy',
        title: 'My Portfolio',
        sortOrder: 1,
        isActive: true,
        createdAt: '2023-01-15T10:40:00Z',
        updatedAt: '2023-01-15T10:40:00Z'
    },
    {
        id: 'link_2',
        label: 'Download Resume',
        url: 'https://realvjy.com/resume.pdf',
        type: 'normal',
        icon: 'file-text',
        profileId: 'realvjy',
        title: 'Download Resume',
        sortOrder: 2,
        isActive: true,
        createdAt: '2023-01-15T10:41:00Z',
        updatedAt: '2023-01-15T10:41:00Z'
    },
    {
        id: 'link_3',
        label: 'Book a Call',
        url: 'https://calendly.com/realvjy',
        type: 'normal',
        icon: 'calendar',
        profileId: 'realvjy',
        title: 'Book a Call',
        sortOrder: 3,
        isActive: true,
        createdAt: '2023-01-15T10:42:00Z',
        updatedAt: '2023-01-15T10:42:00Z'
    }
]

/**
 * Combine all links for a user
 */
export const mockLinksCollection: LinksCollection = {
    userId: 'realvjy',
    links: [...mockBlogLinks, ...mockNormalLinks]
}

/**
 * Mock user preferences
 */
export const mockUserPreferences: UserPreferences = {
    profileId: 'realvjy',
    theme: 'light',
    settings: {
        notifications: {
            email: true,
            push: true,
            linkClicks: true,
            profileViews: true
        },
        privacy: {
            isPublic: true,
            showAnalytics: true,
            allowIndexing: true
        },
        customization: {
            fontFamily: 'Inter',
            buttonStyle: 'rounded',
            animationsEnabled: true
        },
    },
    // seo: {
    //     title: 'Vijay Verma - Designer & Illustrator',
    //     description: 'Connect with Vijay Verma, designer and illustrator. Find all my important links in one place.',
    //     keywords: ['design', 'illustration', 'UI/UX', 'Figma', 'plugins'],
    //     ogImage: 'https://realvjy.com/og-image.png'
    // }
}

/**
 * Generate blocks from profile and links
 */
export const generateMockBlocks = (username: string = 'realvjy'): Block[] => {
    const profile = testUserProfiles.find(p => p.username === username) || testUserProfiles[0]
    const linksCollection = mockLinksCollection

    // Convert profile to blocks
    const profileBlocks = profileToBlocks(profile)

    // Convert links to blocks
    const linkBlocks = linksToBlocks(linksCollection.links)

    // Combine all blocks
    return [...profileBlocks, ...linkBlocks]
}

/**
 * Get a complete user profile by username
 * Returns a single user profile with all associated data (links, preferences, blocks)
 */
export const getCompleteUserProfile = (username: string = 'realvjy') => {
    // Find the user profile
    const profile = testUserProfiles.find(p => p.username === username) || testUserProfiles[0];

    // Get links for this user (in a real app, you'd filter by username)
    const links = {
        ...mockLinksCollection,
        userId: profile.username
    };

    // Generate blocks for this profile
    const blocks = generateMockBlocks(profile.username);

    // Return the complete profile data
    return {
        profile,
        links,
        preferences: mockUserPreferences,
        blocks
    };
}

/**
 * Mock data for a complete user profile with all data
 */
export const mockCompleteUserData = getCompleteUserProfile('realvjy');

/**
 * Mock blocks for testing
 */
export const mockBlocks: Block[] = generateMockBlocks()
