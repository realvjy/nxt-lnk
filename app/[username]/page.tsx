import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProfileContent from '../../components/profile/ProfileContent';

interface ProfilePageProps {
    params: {
        username: string;
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { username } = params;
    const supabase = createServerComponentClient({ cookies });

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !profile) {
            return {
                title: 'Profile Not Found',
                description: 'The requested profile could not be found.'
            };
        }

        return {
            title: `${profile.full_name || username} | Next-Lnks`,
            description: profile.bio ?
                profile.bio.replace(/<[^>]*>/g, '') :
                `Check out ${profile.full_name || username}'s links and profile.`,
            openGraph: {
                title: `${profile.full_name || username} | Next-Lnks`,
                description: profile.bio ?
                    profile.bio.replace(/<[^>]*>/g, '') :
                    `Check out ${profile.full_name || username}'s links and profile.`,
                images: profile.image_url ? [profile.image_url] : [],
            },
        };
    } catch (error) {
        console.error('Error fetching profile metadata:', error);
        return {
            title: 'Profile Not Found',
            description: 'The requested profile could not be found.'
        };
    }
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
    const { username } = params;
    const supabase = createServerComponentClient({ cookies });

    try {
        // Fetch profile data
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !profile) {
            notFound();
        }

        // Fetch blocks data for this profile
        const { data: blocksData, error: blocksError } = await supabase
            .from('blocks')
            .select('*')
            .eq('profile_id', profile.id)
            .order('sort_order', { ascending: true });

        if (blocksError) {
            console.error('Error fetching blocks:', blocksError);
        }

        // Transform blocks to match the app's Block format
        const blocks = blocksData?.map(block => ({
            id: block.id,
            type: block.type,
            props: block.content,
            ...block.content, // Spread content to maintain backward compatibility
            settings: block.settings
        })) || [];

        // Add blocks to the profile object
        const profileWithBlocks = {
            ...profile,
            layout: blocks
        };

        return (
            <Suspense fallback={<div>Loading profile...</div>}>
                <ProfileContent initialProfile={profileWithBlocks} />
            </Suspense>
        );
    } catch (error) {
        console.error('Error fetching profile:', error);
        notFound();
    }
};

export default ProfilePage;