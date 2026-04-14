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

  const todayRoutines = user.routines.filter((r: any) =>
    r.repeating || new Date(r.createdAt).toDateString() === new Date().toDateString()
  );

  const completedTasks = todayRoutines.filter((r: any) => r.completed);
  const pendingTasks = todayRoutines.filter((r: any) => !r.completed);

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
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{todayRoutines.length}</p>
        </TiltCard>

        <TiltCard className="card" style={{ borderLeft: "4px solid var(--accent-success)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Completed</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{completedTasks.length}</p>
        </TiltCard>

        <TiltCard className="card" style={{ borderLeft: "4px solid var(--accent-warning)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Pending</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{pendingTasks.length}</p>
        </TiltCard>

        <TiltCard className="card" style={{ borderLeft: "4px solid #c084fc" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Active Reminders</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{user.reminders.length}</p>
        </TiltCard>
      </div>

      <div className="grid-2">
        <TiltCard className="card">
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Today's Routines</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {todayRoutines.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No routines for today.</p>
            ) : (
              todayRoutines.map((routine: any) => (
                <div key={routine.id} style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: "2px solid " + (routine.completed ? "green" : "gray"),
                        background: routine.completed ? "green" : "transparent",
                      }}
                    />

                    <div>
                      <h4 style={{
                        textDecoration: routine.completed ? "line-through" : "none"
                      }}>
                        {routine.title}
                      </h4>

                      {routine.time && (
                        <p style={{ fontSize: "12px" }}>{routine.time}</p>
                      )}
                    </div>
                  </div>

                  {routine.repeating && <span>Daily</span>}
                </div>
              ))
            )}
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
