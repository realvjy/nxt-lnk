// /app/test/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function TestConnection() {
    const supabase = createServerComponentClient({ cookies })

    // Test database connection and get profiles
    const { data: profiles, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)

    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.getSession()

    const status = {
        database: !dbError,
        auth: !authError,
        overall: !dbError && !authError
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span>Overall Status:</span>
                    <span className={status.overall ? "text-green-500" : "text-red-500"}>
                        {status.overall ? "✓ Connected" : "✗ Issues Found"}
                    </span>
                </div>

                <div className="grid gap-4">
                    <div>
                        <h2 className="font-semibold">Database Connection</h2>
                        <div className={status.database ? "text-green-500" : "text-red-500"}>
                            {status.database ? "✓ Connected" : `✗ Error: ${dbError?.message}`}
                        </div>
                        {profiles && profiles.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Sample Profiles:</h3>
                                <div className="bg-gray-50 p-4 rounded">
                                    {profiles.map((profile) => (
                                        <div key={profile.id} className="mb-2 last:mb-0">
                                            <div className="font-medium">{profile.full_name || profile.username}</div>
                                            <div className="text-sm text-gray-600">{profile.bio || 'No bio'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="font-semibold">Authentication</h2>
                        <div className={status.auth ? "text-green-500" : "text-red-500"}>
                            {status.auth ? "✓ Working" : `✗ Error: ${authError?.message}`}
                        </div>
                        {authData?.session && (
                            <div className="mt-2 text-sm text-gray-600">
                                Current user: {authData.session.user.email}
                            </div>
                        )}
                    </div>
                </div>

                {status.overall && (
                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded">
                        ✓ All systems operational
                    </div>
                )}

                {!status.overall && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded">
                        Please check your environment variables and Supabase project settings
                    </div>
                )}
            </div>
        </div>
    )
}