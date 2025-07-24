'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const router = useRouter();
    const { supabase } = useSupabase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle verification errors
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const errorType = searchParams.get('error');

        if (errorType) {
            switch (errorType) {
                case 'auth_error':
                    setError('Authentication failed. Please try signing up again.');
                    break;
                case 'session_error':
                    setError('Session creation failed. Please try signing up again.');
                    break;
                case 'no_code':
                    setError('Invalid verification link. Please try signing up again.');
                    break;
                case 'unknown':
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                router.push('/edit');
                router.refresh();
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!password || password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }

            // 0) make a unique username
            const makeAvailableUsername = async (base: string) => {
                let candidate = base.toLowerCase();
                for (let i = 1; i < 100; i++) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('username', candidate)
                        .limit(1);

                    if (error) {
                        console.error('username check error', error);
                        break; // fallback to whatever we have
                    }
                    if (!data?.length) return candidate; // free
                    candidate = `${base}${i}`;
                }
                return `${base}${crypto.randomUUID().slice(0, 6)}`;
            };

            const base = email.split('@')[0];
            const username = await makeAvailableUsername(base);

            // 1) sign up - DO NOT insert into profiles
            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: { username } // trigger will pick this up
                }
            });

            if (signUpError) throw signUpError;
            if (!user) throw new Error('No user returned after signup');

            // 2) Create initial profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    user_id: user.id,
                    username: username,
                    email: email,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (profileError) {
                console.warn('Could not create profile:', profileError);
            }

            setError('Please check your email for the verification link');
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message ?? 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to Next-Lnks</CardTitle>
                    <CardDescription>Sign in to manage your links</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-500">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col space-y-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Sign In'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSignUp}
                                disabled={isLoading}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
