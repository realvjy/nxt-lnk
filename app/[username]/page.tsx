import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { profileService } from '@/supabase/services/profile';
import { linkService } from '@/supabase/services/links';
import { mapBlockFromDb, mapLinkFromDb } from '@/shared/supabase/mappings';
import { Block } from '@/shared/app/blocks';
import { Link } from '@/shared/app/links';
import { UserProfile } from '@/shared/app/profile';
import dynamic from 'next/dynamic';

// Import ProfileContent component dynamically to avoid SSR issues
const ProfileContent = dynamic(() => import('@/components/profile/ProfileContent'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Loading profile...</div>
});

// Define the page props type
interface PageProps {
    params: {
        username: string;
    };
}

// Generate metadata for the page
export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the username from params
    const { username } = params;

    // Create a Supabase client
    const supabase = createServerComponentClient({ cookies });

    // Fetch the profile data
    const profile = await profileService.getProfile(username);

    // If no profile is found, return default metadata
    if (!profile) {
        return {
            title: 'Profile Not Found | Next-Lnks',
            description: 'The requested profile could not be found.',
        };
    }

    // Generate metadata based on the profile
    return {
        title: `${profile.fullName || profile.username} | Next-Lnks`,
        description: profile.tagline || `Check out ${profile.username}'s links`,
        openGraph: {
            title: `${profile.fullName || profile.username} | Next-Lnks`,
            description: profile.tagline || `Check out ${profile.username}'s links`,
            // images: profile.imageUrl ? [{ url: profile.imageUrl }] : [],
        },
    };
}

// The main page component
export default async function UsernamePage({ params }: PageProps) {
    const { username } = params;
    const supabase = createServerComponentClient({ cookies });

    try {
        // Fetch the profile data
        const profile = await profileService.getProfile(username);

        // If no profile is found, return 404
        if (!profile) {
            notFound();
        }

        // Fetch blocks for this profile
        const { data: blocksData, error: blocksError } = await supabase
            .from('blocks')
            .select('*')
            .eq('profile_id', profile.id)
            .order('sort_order', { ascending: true });

        if (blocksError) {
            console.error('Error fetching blocks:', blocksError);
        }

        // Fetch links for this profile
        const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('profile_id', profile.id)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (linksError) {
            console.error('Error fetching links:', linksError);
        }

        // Map database blocks to app blocks
        const blocks: Block[] = blocksData?.map(block => mapBlockFromDb(block)) || [];

        // Map database links to app links
        const links: Link[] = linksData?.map(link => mapLinkFromDb(link) as Link) || [];

        // Prepare the data for the client component
        const profileData = {
            ...profile,
            blocks: blocks,
            links: links
        };

        // Return the page component
        return (
            <ProfileContent initialProfile={profileData} />
        );
    } catch (error) {
        console.error('Error in UsernamePage:', error);
        notFound();
    }
}