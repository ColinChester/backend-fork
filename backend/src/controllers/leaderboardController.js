import { getLeaderboard as getLeaderboardService } from '../services/gameService.js';

export const getLeaderboard = async (req, res) => {
  const { limit } = req.query;
  const maxEntries = Math.max(1, Math.min(Number(limit) || 20, 50));

  try {
    const leaderboard = await getLeaderboardService({ limit: maxEntries });
    res.json({ leaderboard });
  } catch (error) {
    console.error('Failed to fetch leaderboard', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
