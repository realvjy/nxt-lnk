// UsernameSetting.tsx
import { useBuilderStore } from '@/store/useBuilderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'

export function UsernameSetting() {
    const username = useBuilderStore((s) => s.username)
    const setUsername = useBuilderStore((s) => s.setUsername)

    // Save username to localStorage on change
    useEffect(() => {
        if (username) localStorage.setItem('active:username', username)
    }, [username])

    return (
        <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
                id="username"
                value={username}
                onChange={(e) => {
                    const val = e.target.value
                    if (/^[a-zA-Z0-9_-]*$/.test(val)) {
                        setUsername(val)
                    }
                }}
                placeholder="your-handle"
            />
        </div>
    )
}
