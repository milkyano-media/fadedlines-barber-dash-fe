import React from "react";
import { Link } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ThemeToggle } from "./common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navigation = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center px-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl">
                    FadedLine
                </Link>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-muted-foreground">Hi, {user?.name}</span>
                            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="sm">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
