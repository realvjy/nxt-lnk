'use client';
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
                <button
                    onClick={resetLocalStorage}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Reset Local Storage
                </button>

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
            <div className="bg-debug text-white p-4">Custom color test</div>
            <div className="p-6 bg-red-500 text-white">
                This should be red
            </div>
        </main>
    );
}
