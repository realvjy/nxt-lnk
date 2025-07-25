'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
        <>
            <Navbar />
            <main className="container mx-auto p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="py-12 text-center">
                        <h1 className="text-4xl font-bold mb-4">Create Your Link Page</h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Build a beautiful profile page with all your important links in one place.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild size="lg">
                                <Link href="/login">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Button
                            variant="outline"
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
                            <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
                                {JSON.stringify(storageData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
