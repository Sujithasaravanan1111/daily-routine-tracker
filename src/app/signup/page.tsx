"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import { signIn, useSession } from "next-auth/react";

export default function SignupPage() {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                const signRes = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });
                if (signRes?.error) {
                    setError("Failed to login after registration");
                } else {
                    router.push("/");
                    router.refresh();
                }
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    if (status === "loading" || status === "authenticated") {
        return null;
    }

    return (
        <div className="auth-container" style={{ margin: "-2.5rem -3rem", width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 50 }}>
            <TiltCard className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Start tracking your daily routines</p>

                {error && (
                    <div style={{ color: "var(--accent-danger)", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
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
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </TiltCard>
        </div>
    );
}
