import { prisma } from "./prisma";

/**
 * Updates the user's daily streak.
 * Logic:
 * 1. If lastActive is today: No change to streakCount.
 * 2. If lastActive was yesterday: Increment streakCount by 1.
 * 3. If lastActive was more than 1 day ago (or null): Reset streakCount to 1.
 * Always sets lastActive to today.
 */
export async function updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { streakCount: true, lastActive: true }
    });

    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let newStreak = user.streakCount;
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;

    if (!lastActive) {
        newStreak = 1;
    } else {
        const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffTime = today.getTime() - lastActiveDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
        } else if (diffDays > 1) {
            // Gap in activity - reset
            newStreak = 1;
        } else if (diffDays === 0) {
            // Already active today
            return;
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            streakCount: newStreak,
            lastActive: now
        }
    });
}
