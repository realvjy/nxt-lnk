'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { ArrowLeft, LogOut, LogIn, User, Settings } from 'lucide-react';

interface NavbarProps {
    showBackButton?: boolean;
    title?: string;
    subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    showBackButton = false,
    title = 'Next-Lnks',
    subtitle,
}) => {
    const pathname = usePathname();
    const { logout } = useSupabase();
    const [user, setUser] = React.useState<any>(null);
    const { supabase } = useSupabase();

    React.useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error && data.session) {
                const { data: userData } = await supabase.auth.getUser();
                setUser(userData.user);
            }
        };

        checkUser();
    }, [supabase]);

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link href="/">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Link>
                                </Button>
                                <div className="h-6 w-px bg-border" />
                            </>
                        )}

                        <div>
                            <h1 className="text-xl font-semibold">{title}</h1>
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/edit">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Editor
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Link>
                                </Button>

                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/login">
                                        <User className="w-4 h-4 mr-2" />
                                        Sign Up
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
