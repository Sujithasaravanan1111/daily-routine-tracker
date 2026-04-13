"use client";

import { useState, useEffect } from "react";

type Routine = {
    id: string;
    title: string;
    time: string | null;
    repeating: boolean;
    completed: boolean;
};

export default function RoutinesPage() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [repeating, setRepeating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        const res = await fetch("/api/routines");
        if (res.ok) {
            const data = await res.json();
            setRoutines(data);
        }
        setLoading(false);
    };

    const addRoutine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const res = await fetch("/api/routines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, time, repeating }),
        });

        if (res.ok) {
            setTitle("");
            setTime("");
            setRepeating(false);
            fetchRoutines();
        }
    };

    const toggleCompletion = async (id: string, completed: boolean) => {
        await fetch(`/api/routines/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        });
        fetchRoutines();
    };

    const deleteRoutine = async (id: string) => {
        if (confirm("Are you sure you want to delete this routine?")) {
            await fetch(`/api/routines/${id}`, { method: "DELETE" });
            fetchRoutines();
        }
    };

    if (loading) return <div>Loading routines...</div>;

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1 className="page-title">Manage Routines</h1>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div className="card" style={{ alignSelf: "start" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Add Routine</h2>
                    <form onSubmit={addRoutine}>
                        <div className="form-group">
                            <label className="form-label">Routine Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Read a book" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time (Optional)</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input type="checkbox" id="repeating" checked={repeating} onChange={(e) => setRepeating(e.target.checked)} style={{ width: "auto" }} />
                            <label htmlFor="repeating" style={{ color: "var(--text-secondary)" }}>Repeat daily</label>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Add Routine</button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Your Routines ({routines.length})</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {routines.map((routine) => (
                            <div key={routine.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button onClick={() => toggleCompletion(routine.id, routine.completed)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${routine.completed ? "var(--accent-success)" : "var(--text-secondary)"}`, background: routine.completed ? "var(--accent-success)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                                        {routine.completed && <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                    <div>
                                        <h4 style={{ fontWeight: 500, textDecoration: routine.completed ? "line-through" : "none", color: routine.completed ? "var(--text-secondary)" : "var(--text-primary)" }}>{routine.title}</h4>
                                        {routine.time && <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{routine.time}</p>}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    {routine.repeating && <span className="badge badge-warning">Daily</span>}
                                    <button onClick={() => deleteRoutine(routine.id)} style={{ color: "var(--accent-danger)", padding: "0.5rem" }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {routines.length === 0 && <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>No routines found. Add one to get started!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
