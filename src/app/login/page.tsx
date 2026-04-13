"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="auth-container" style={{ margin: "-2.5rem -3rem", width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 50 }}>
            <TiltCard className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to manage your routines</p>

                {error && (
                    <div style={{ color: "var(--accent-danger)", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                        Sign In
                    </button>
                </form>

                <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Don't have an account?{" "}
                    <Link href="/signup" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                        Sign up
                    </Link>
                </p>
            </TiltCard>
        </div>
    );
}
