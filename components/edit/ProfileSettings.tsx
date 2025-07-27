import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/lib/stores/userStore';

const ProfileSettings: React.FC = () => {
    const { username, setUsername } = useUserStore();
    const [usernameInput, setUsernameInput] = useState(username || '');
    const [usernameError, setUsernameError] = useState('');

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase();
        setUsernameInput(value);

        // Validation logic here
        if (!value) {
            setUsernameError('Username is required');
        } else if (value.length < 3) {
            setUsernameError('Username must be at least 3 characters');
        } else if (value.length > 20) {
            setUsernameError('Username must be less than 20 characters');
        } else if (!/^[a-z0-9_-]+$/.test(value)) {
            setUsernameError('Username can only contain lowercase letters, numbers, underscores, and hyphens');
        } else {
            setUsernameError('');
            setUsername(value);
        }
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">Profile Settings</h3>
                </div>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={usernameInput}
                            onChange={handleUsernameChange}
                            placeholder="Enter username"
                            className={usernameError ? 'border-red-500' : ''}
                        />
                        {usernameError && (
                            <p className="text-xs text-red-500 mt-1">{usernameError}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileSettings;