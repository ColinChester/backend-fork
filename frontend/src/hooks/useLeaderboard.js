import { useQuery } from '@tanstack/react-query'
import { leaderboardAPI } from '../utils/api'

export const useLeaderboard = (limit = 20) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => leaderboardAPI.getLeaderboard(limit),
    staleTime: 10_000,
  })
}
