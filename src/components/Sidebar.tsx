"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (!session) return null;

    const links = [
        { name: "Dashboard", path: "/" },
        { name: "Routines", path: "/routines" },
        { name: "Workouts", path: "/workouts" },
        { name: "Reminders", path: "/reminders" },
        { name: "Notes", path: "/notes" },
        { name: "Calendar", path: "/calendar" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" height="28" width="28">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                RoutineTracker
            </div>

            <nav className="nav-links">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`nav-item ${pathname === link.path ? "active" : ""}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="nav-item" style={{ marginBottom: "1rem" }}>
                    {session.user?.name || session.user?.email}
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="btn-secondary w-full"
                    style={{ width: "100%" }}
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
