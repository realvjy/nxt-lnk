// app/[username]/page.tsx - Public Profile View (Server Component)
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCompleteUserProfile } from '@/lib/constants/testData'; // Replace with your data fetching
import ProfileContent from '../../components/profile/ProfileContent';

interface ProfilePageProps {
    params: {
        username: string;
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { username } = params;

    try {
        // In a real app, fetch user data from your API/database
        const userData = getCompleteUserProfile(username);

        if (!userData) {
            return {
                title: 'Profile Not Found',
                description: 'The requested profile could not be found.'
            };
        }

        const { profile } = userData;

        return {
            title: `${profile.fullName || username} | Next-Lnks`,
            description: profile.bio ?
                profile.bio.replace(/<[^>]*>/g, '') :
                `Check out ${profile.fullName || username}'s links and profile.`,
            openGraph: {
                title: `${profile.fullName || username} | Next-Lnks`,
                description: profile.bio ?
                    profile.bio.replace(/<[^>]*>/g, '') :
                    `Check out ${profile.fullName || username}'s links and profile.`,
                images: profile.image?.url ? [profile.image.url] : [],
            },
        };
    } catch (error) {
        return {
            title: 'Profile Not Found',
            description: 'The requested profile could not be found.'
        };
    }
}

// Static params generation for SSG (optional)
export async function generateStaticParams() {
    // In a real app, fetch all usernames from your database
    // For now, return empty array to generate pages on-demand
    return [];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ params }) => {
    const { username } = params;

    // We'll pass the username to ProfileContent which will:
    // 1. First try to load real data from localStorage
    // 2. Fall back to mock data if no real data exists
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <ProfileContent username={username} />
        </Suspense>
    );
};

export default ProfilePage;