import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MotivationalQuote from "@/components/MotivationalQuote";
import TiltCard from "@/components/TiltCard";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      routines: true,
      workouts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      reminders: {
        where: { active: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const todayRoutines = user.routines.filter((r) => r.repeating || new Date(r.createdAt).toDateString() === new Date().toDateString());
  const completedTasks = todayRoutines.filter((r) => r.completed);
  const pendingTasks = todayRoutines.filter((r) => !r.completed);

  return (
    <div className="page-transition">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name || "User"}!</h1>
        <p style={{ color: "var(--text-secondary)" }}>Here's your schedule for today.</p>
      </div>

      <MotivationalQuote />

      <div className="grid-4" style={{ marginBottom: "2.5rem" }}>
        <TiltCard className="card" style={{ borderLeft: "4px solid var(--accent-primary)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Total Routines</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{todayRoutines.length}</p>
        </TiltCard>
        <TiltCard className="card" style={{ borderLeft: "4px solid var(--accent-success)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Completed</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{completedTasks.length}</p>
        </TiltCard>
        <TiltCard className="card" style={{ borderLeft: "4px solid var(--accent-warning)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Pending</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{pendingTasks.length}</p>
        </TiltCard>
        <TiltCard className="card" style={{ borderLeft: "4px solid #c084fc" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Active Reminders</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>{user.reminders.length}</p>
        </TiltCard>
      </div>

      <div className="grid-2">
        <TiltCard className="card">
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Today's Routines</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {todayRoutines.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No routines for today.</p>
            ) : (
              todayRoutines.map((routine) => (
                <div key={routine.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${routine.completed ? "var(--accent-success)" : "var(--text-secondary)"}`, background: routine.completed ? "var(--accent-success)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {routine.completed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 500, textDecoration: routine.completed ? "line-through" : "none", color: routine.completed ? "var(--text-secondary)" : "var(--text-primary)" }}>{routine.title}</h4>
                      {routine.time && <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{routine.time}</p>}
                    </div>
                  </div>
                  {routine.repeating && <span className="badge badge-warning">Daily</span>}
                </div>
              ))
            )}
          </div>
        </TiltCard>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TiltCard className="card">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Workout Summary
              <a href="/workouts" style={{ fontSize: "0.875rem", color: "var(--accent-primary)" }}>View all</a>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.workouts.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>No recent workouts.</p>
              ) : (
                user.workouts.map((workout) => (
                  <div key={workout.id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: "1px solid var(--bg-tertiary)" }}>
                    <div>
                      <h4 style={{ fontWeight: 500 }}>{workout.exercise}</h4>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{new Date(workout.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 600 }}>{workout.sets} sets x {workout.reps} reps</p>
                      {workout.duration && <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{workout.duration} min</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TiltCard>

          <TiltCard className="card">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Upcoming Reminders</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.reminders.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }}>No active reminders.</p>
              ) : (
                user.reminders.map((reminder) => (
                  <div key={reminder.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ padding: "0.5rem", background: "rgba(245, 158, 11, 0.1)", color: "var(--accent-warning)", borderRadius: "var(--radius-md)" }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 500 }}>{reminder.title}</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{reminder.time} {reminder.repeating && "• Daily"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
