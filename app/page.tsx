'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const [resetMessage, setResetMessage] = useState('');
    const [storageData, setStorageData] = useState<Record<string, string>>({});

    // Load and log all localStorage data
    useEffect(() => {
        try {
            const data: Record<string, string> = {};
            // Iterate through all localStorage items
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    data[key] = value || '';
                }
            }

            console.log('Current localStorage data:', data);
            setStorageData(data);
        } catch (error) {
            console.error('Error loading localStorage data:', error);
        }
    }, [resetMessage]); // Re-run when resetMessage changes (after reset)

    const resetLocalStorage = () => {
        try {
            // Clear all local storage items
            localStorage.clear();
            setResetMessage('Local storage has been reset successfully!');
            setTimeout(() => setResetMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Error resetting local storage:', error);
            setResetMessage('Failed to reset local storage.');
        }
    };

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold">Welcome to mytiny.page 🚀</h1>

            <div className="mt-8">
                <Button
                    variant="destructive"
                    onClick={resetLocalStorage}
                >
                    Reset Local Storage
                </Button>

                {resetMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                        {resetMessage}
                    </div>
                )}
            </div>

            {Object.keys(storageData).length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Current LocalStorage Data:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(storageData, null, 2)}
                    </pre>
                </div>
            )}

        </main>
    );
}
