"use client";

import { useState, useEffect } from "react";

type Workout = {
    id: string;
    exercise: string;
    sets: number;
    reps: number;
    duration: number | null;
    createdAt: string;
};

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("3");
    const [reps, setReps] = useState("10");
    const [duration, setDuration] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        const res = await fetch("/api/workouts");
        if (res.ok) {
            const data = await res.json();
            setWorkouts(data);
        }
        setLoading(false);
    };

    const addWorkout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exercise || !sets || !reps) return;

        const res = await fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exercise, sets, reps, duration }),
        });

        if (res.ok) {
            setExercise("");
            setSets("3");
            setReps("10");
            setDuration("");
            fetchWorkouts();
        }
    };

    if (loading) return <div>Loading workouts...</div>;

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1 className="page-title">Workout Tracker</h1>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div className="card" style={{ alignSelf: "start" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Record Workout</h2>
                    <form onSubmit={addWorkout}>
                        <div className="form-group">
                            <label className="form-label">Exercise Name</label>
                            <input type="text" value={exercise} onChange={(e) => setExercise(e.target.value)} required placeholder="Bench Press, Squats, etc." />
                        </div>
                        <div className="form-group" style={{ display: "flex", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Sets</label>
                                <input type="number" min="1" value={sets} onChange={(e) => setSets(e.target.value)} required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Reps</label>
                                <input type="number" min="1" value={reps} onChange={(e) => setReps(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Duration (minutes) - Optional</label>
                            <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Save Workout</button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Workout History</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {workouts.map((workout) => (
                            <div key={workout.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                                <div>
                                    <h4 style={{ fontWeight: 600, fontSize: "1.1rem" }}>{workout.exercise}</h4>
                                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{new Date(workout.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div className="badges" style={{ justifyContent: "flex-end", marginBottom: "0.5rem" }}>
                                        <span className="badge badge-success">{workout.sets} sets</span>
                                        <span className="badge badge-success">{workout.reps} reps</span>
                                    </div>
                                    {workout.duration && <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{workout.duration} mins</p>}
                                </div>
                            </div>
                        ))}
                        {workouts.length === 0 && <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>No workouts recorded yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
