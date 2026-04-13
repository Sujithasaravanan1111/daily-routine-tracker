"use client";

import { useState, useEffect } from "react";

type Note = {
    id: string;
    title: string;
    content: string;
    date: string | null;
    createdAt: string;
};

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const res = await fetch("/api/notes");
        if (res.ok) {
            const data = await res.json();
            setNotes(data);
        }
        setLoading(false);
    };

    const addNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, date: date || null }),
        });

        if (res.ok) {
            setTitle("");
            setContent("");
            setDate("");
            fetchNotes();
        }
    };

    if (loading) return <div>Loading notes...</div>;

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1 className="page-title">Personal Memory Tracker</h1>
            </div>

            <div className="grid-2" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div className="card" style={{ alignSelf: "start" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Save a Memory</h2>
                    <form onSubmit={addNote}>
                        <div className="form-group">
                            <label className="form-label">Note Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Birthday Ideas..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Details</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} placeholder="Write down your thoughts..."></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Important Date (Optional)</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Save Note</button>
                    </form>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Your Notes</h2>
                    <div className="grid-2">
                        {notes.map((note) => (
                            <div key={note.id} style={{ padding: "1.25rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", borderTop: "4px solid #c084fc", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <h4 style={{ fontWeight: 600, fontSize: "1.1rem" }}>{note.title}</h4>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", flex: 1 }}>{note.content}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date(note.createdAt).toLocaleDateString()}</p>
                                    {note.date && (
                                        <span className="badge" style={{ background: "rgba(192, 132, 252, 0.1)", color: "#c084fc" }}>
                                            Event: {new Date(note.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {notes.length === 0 && <p style={{ color: "var(--text-secondary)", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>No notes saved. Record your first memory above!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
