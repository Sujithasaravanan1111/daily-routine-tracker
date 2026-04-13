"use client";

import { useState, useEffect, useRef } from "react";

type Reminder = {
    id: string;
    title: string;
    time: string;
    repeating: boolean;
    active: boolean;
};

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [repeating, setRepeating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const lastTriggerRef = useRef<Record<string, number>>({});

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "granted") {
            setNotificationsEnabled(true);
        }
        fetchReminders();

        // Active notification polling (every second)
        const interval = setInterval(() => {
            checkAlarms();
        }, 1000); 
        return () => clearInterval(interval);
    }, [reminders]);

    const fetchReminders = async () => {
        const res = await fetch("/api/reminders");
        if (res.ok) {
            const data = await res.json();
            setReminders(data);
        }
        setLoading(false);
    };

    const addReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !time) return;

        const res = await fetch("/api/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, time, repeating }),
        });

        if (res.ok) {
            setTitle("");
            setTime("");
            setRepeating(false);
            fetchReminders();
        }
    };

    const playAlarmSound = () => {
        const audio = new Audio('/alarm.mp3');
        audio.play().catch(e => console.log('Audio playback prevented by browser:', e));
    };

    const triggerNotification = (title: string, bodyContent: string = "It's time for your task!") => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body: bodyContent });
        } else {
            alert(`⏰ Reminder: ${title}`);
        }
    };

    const checkAlarms = () => {
        if (reminders.length === 0) return;
        
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        reminders.forEach((reminder) => {
            if (reminder.active && reminder.time === currentTime) {
                if (!lastTriggerRef.current[reminder.id]) {
                    lastTriggerRef.current[reminder.id] = 1; // Mark as triggered
                    playAlarmSound();
                    triggerNotification("Alarm: " + reminder.title);
                }
            }
        });
    };

    const requestNotificationPermission = async () => {
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                setNotificationsEnabled(true);
            }
        }
    };

    const toggleCompletion = async (id: string, currentActive: boolean) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !currentActive } : r));
        await fetch(`/api/reminders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: !currentActive }),
        });
        fetchReminders();
    };


    const deleteReminder = async (id: string) => {
        if (confirm("Are you sure you want to delete this reminder?")) {
            setReminders(prev => prev.filter(r => r.id !== id));
            await fetch(`/api/reminders/${id}`, { method: "DELETE" });
            fetchReminders();
        }
    };

    if (loading) return <div>Loading reminders...</div>;

    return (
        <div className="page-transition">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="page-title">Reminders & Alarms</h1>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button 
                        onClick={requestNotificationPermission} 
                        className={notificationsEnabled ? "btn-secondary" : "btn-primary"} 
                        disabled={notificationsEnabled}
                        style={{ 
                            fontSize: "0.875rem",
                            borderColor: notificationsEnabled ? "var(--accent-success)" : "",
                            color: notificationsEnabled ? "var(--accent-success)" : "",
                            opacity: notificationsEnabled ? 0.8 : 1
                        }}
                    >
                        {notificationsEnabled ? "Notifications Enabled ✅" : "Enable Notifications"}
                    </button>
                </div>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div className="card" style={{ alignSelf: "start" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Set Reminder</h2>
                    <form onSubmit={addReminder}>
                        <div className="form-group">
                            <label className="form-label">Reminder Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Drink Water" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input type="checkbox" id="repeating" checked={repeating} onChange={(e) => setRepeating(e.target.checked)} style={{ width: "auto" }} />
                            <label htmlFor="repeating" style={{ color: "var(--text-secondary)" }}>Repeat daily</label>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Save Alarm</button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Active Reminders</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {reminders.map((reminder) => (
                            <div key={reminder.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", borderLeft: reminder.active ? "3px solid var(--accent-warning)" : "3px solid var(--accent-success)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button onClick={() => toggleCompletion(reminder.id, reminder.active)} style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${!reminder.active ? "var(--accent-success)" : "var(--text-secondary)"}`, background: !reminder.active ? "var(--accent-success)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                                        {!reminder.active && <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                    <div>
                                        <h4 style={{ fontWeight: 600, fontSize: "1.1rem", textDecoration: !reminder.active ? "line-through" : "none", color: reminder.active ? "var(--text-primary)" : "var(--text-secondary)" }}>{reminder.title}</h4>
                                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                            <span className="badge badge-warning" style={{ display: "flex", alignItems: "center", gap: "0.25rem", filter: !reminder.active ? "grayscale(100%)" : "none", opacity: !reminder.active ? 0.6 : 1 }}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {reminder.time}
                                            </span>
                                            {reminder.repeating && <span className="badge" style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-primary)" }}>Daily</span>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                    <span style={{ fontSize: "0.875rem", color: reminder.active ? "var(--accent-warning)" : "var(--accent-success)", fontWeight: 500 }}>
                                        {reminder.active ? "Active" : "Completed"}
                                    </span>
                                    <button onClick={() => deleteReminder(reminder.id)} style={{ color: "var(--accent-danger)", padding: "0.5rem", transition: "transform 0.2s" }} className="hover:scale-110">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {reminders.length === 0 && <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>No reminders set. Create your first alarm!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
