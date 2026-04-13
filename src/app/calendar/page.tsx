"use client";

import { useState, useEffect } from "react";

type Routine = { id: string; title: string; time: string | null; repeating: boolean; completed: boolean; createdAt: string };
type Workout = { id: string; exercise: string; sets: number; reps: number; createdAt: string };
type Note = { id: string; title: string; date: string | null; createdAt: string };

export default function CalendarPage() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Simple calendar logic
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    useEffect(() => {
        Promise.all([
            fetch("/api/routines").then(res => res.json()),
            fetch("/api/workouts").then(res => res.json()),
            fetch("/api/notes").then(res => res.json())
        ]).then(([rData, wData, nData]) => {
            setRoutines(Array.isArray(rData) ? rData : []);
            setWorkouts(Array.isArray(wData) ? wData : []);
            setNotes(Array.isArray(nData) ? nData : []);
            setLoading(false);
        });
    }, []);

    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else setCurrentMonth(currentMonth - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else setCurrentMonth(currentMonth + 1);
    };

    const isToday = (day: number) => {
        return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    };

    const getEventsForDay = (day: number) => {
        const dateStr = new Date(currentYear, currentMonth, day).toDateString();

        // Repeating routines show up every day
        const dayRoutines = routines.filter(r => r.repeating || new Date(r.createdAt).toDateString() === dateStr);
        const dayWorkouts = workouts.filter(w => new Date(w.createdAt).toDateString() === dateStr);
        const dayNotes = notes.filter(n => (n.date && new Date(n.date).toDateString() === dateStr) || (!n.date && new Date(n.createdAt).toDateString() === dateStr));

        return { routines: dayRoutines, workouts: dayWorkouts, notes: dayNotes };
    };

    if (loading) return <div>Loading calendar...</div>;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1 className="page-title">Calendar</h1>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button onClick={prevMonth} className="btn-secondary" style={{ padding: "0.5rem 1rem" }}>Previous</button>
                    <span style={{ fontSize: "1.25rem", fontWeight: 600, minWidth: "150px", textAlign: "center" }}>
                        {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button onClick={nextMonth} className="btn-secondary" style={{ padding: "0.5rem 1rem" }}>Next</button>
                </div>
            </div>

            <div className="card" style={{ padding: "0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "var(--bg-tertiary)", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)" }}>
                    {dayNames.map(day => (
                        <div key={day} style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "var(--text-secondary)" }}>
                            {day}
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderLeft: "1px solid var(--bg-tertiary)" }}>
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ minHeight: "120px", borderBottom: "1px solid var(--bg-tertiary)", borderRight: "1px solid var(--bg-tertiary)", background: "rgba(255,255,255,0.02)" }}></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const events = getEventsForDay(day);
                        const hasEvents = events.routines.length > 0 || events.workouts.length > 0 || events.notes.length > 0;

                        return (
                            <div key={day} style={{ minHeight: "120px", borderBottom: "1px solid var(--bg-tertiary)", borderRight: "1px solid var(--bg-tertiary)", padding: "0.5rem", background: isToday(day) ? "rgba(59, 130, 246, 0.1)" : "transparent" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                    <span style={{ fontWeight: isToday(day) ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: isToday(day) ? "var(--accent-primary)" : "transparent", color: isToday(day) ? "white" : "var(--text-primary)" }}>
                                        {day}
                                    </span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                    {events.routines.length > 0 && (
                                        <div style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {events.routines.length} Routines
                                        </div>
                                    )}
                                    {events.workouts.length > 0 && (
                                        <div style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {events.workouts.length} Workouts
                                        </div>
                                    )}
                                    {events.notes.length > 0 && (
                                        <div style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem", background: "rgba(192, 132, 252, 0.15)", color: "#c084fc", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {events.notes.length} Notes
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
