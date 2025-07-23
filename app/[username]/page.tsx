// app/[username]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BlockRenderer from '@/components/editor/BlockRenderer'
import { ProfileCard } from '@/components/ProfileCard'
import { LinkCard } from '@/components/LinkCard'

import {
    getCompleteUserProfile
} from '@/lib/constants/testData'
export default function UserPage() {
    const { username } = useParams()
    const [layout, setLayout] = useState([])
    const [showMockData, setShowMockData] = useState(true)
    const [mockProfile, setMockProfile] = useState(null)

    useEffect(() => {
        if (!username || typeof username !== 'string') return

        const saved = localStorage.getItem(`user:${username}`)
        if (saved) {
            try {
                setLayout(JSON.parse(saved))
            } catch (err) {
                console.error('Failed to parse layout:', err)
            }
        }
        // Load mock profile data
        const profileData = getCompleteUserProfile(username)
        setMockProfile(profileData)
    }, [username])



    if (!layout.length) {
        return <div className="p-6 text-gray-500">No content for "{username}"</div>
    }

    return (
        <main className="max-w-md mx-auto p-6 space-y-6">


            <div className="space-y-3">
                {layout.map((block, i) => (
                    <BlockRenderer block={block} isEdit={false} />
                ))}

            </div>
            {/* Mock Data Display Section */}
            {showMockData && mockProfile && (
                <div className="mt-12 p-6 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-bold mb-4">Profile Preview: @{mockProfile.profile.username}</h2>

                    {/* Profile Section */}
                    <div className="mb-6 p-4 border rounded bg-white">
                        <div className="flex items-center gap-4 mb-3">
                            {mockProfile.profile.image && (
                                <img
                                    src={mockProfile.profile.image.url}
                                    alt={mockProfile.profile.image.alt}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{mockProfile.profile.fullName}</h3>
                                <p className="text-gray-500">@{mockProfile.profile.username}</p>
                                {mockProfile.profile.tagline && (
                                    <p className="text-sm text-gray-700 mt-1">{mockProfile.profile.tagline}</p>
                                )}
                            </div>
                            {mockProfile.profile.badge && (
                                <span className="ml-auto px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                                    {mockProfile.profile.badge}
                                </span>
                            )}
                        </div>

                        <div
                            className="prose prose-sm mt-4 bio-content"
                            dangerouslySetInnerHTML={{ __html: mockProfile.profile.bio }}
                        />
                    </div>

                    {/* Links Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Links</h3>
                        <div className="space-y-3">
                            {/* Social Links */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {mockProfile.links.links
                                    .filter(link => link.type === 'social')
                                    .map(link => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                                            title={link.label}
                                        >
                                            <span>{link.platform}</span>
                                        </a>
                                    ))
                                }
                            </div>

                            {/* Blog Links */}
                            {mockProfile.links.links
                                .filter(link => link.type === 'blog')
                                .map(link => (
                                    <div key={link.id} className="border rounded overflow-hidden">
                                        {link.cover && (
                                            <img
                                                src={link.cover}
                                                alt={link.label}
                                                className="w-full h-32 object-cover"
                                            />
                                        )}
                                        <div className="p-3">
                                            <h4 className="font-medium">{link.label}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 mt-2 inline-block"
                                            >
                                                Read Article →
                                            </a>
                                        </div>
                                    </div>
                                ))
                            }

                            {/* Normal Links */}
                            {mockProfile.links.links
                                .filter(link => link.type === 'normal')
                                .map(link => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 border rounded hover:bg-gray-100"
                                    >
                                        <span className="font-medium">{link.label}</span>
                                        <span className="ml-auto text-sm text-gray-500">{link.icon}</span>
                                    </a>
                                ))
                            }
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Theme & Preferences</h3>
                        <div className="p-4 border rounded bg-white">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600">Theme:</div>
                                <div>{mockProfile.preferences.theme}</div>

                                <div className="text-gray-600">Color Theme:</div>
                                <div>{mockProfile.preferences.colorTheme}</div>

                                <div className="text-gray-600">Layout:</div>
                                <div>{mockProfile.preferences.layout}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowMockData(false)}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                        Hide Mock Data
                    </button>
                </div>
            )}
        </main>
    )
}
