import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Avatar from '../../components/Avatars/Avatar'
import Button from '../../components/Buttons/Button'
import Card from '../../components/Cards/Card'
import Container from '../../components/Layout/Container'
import { AnimatedBackground } from '../../components/Background'
import { ThemeToggle } from '../../components/ThemeToggle'
import { useThemeClasses } from '../../hooks/useThemeClasses'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { useUser } from '../../context/UserContext'

const Leaderboard = () => {
  const navigate = useNavigate()
  const themeClasses = useThemeClasses()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('global')
  const { data, isLoading, isError, error, refetch, isFetching } = useLeaderboard(20)

  const tabs = [
    { id: 'global', label: 'Global', icon: '🌍', available: true },
    { id: 'friends', label: 'Friends', icon: '👥', available: false },
    { id: 'weekly', label: 'Weekly', icon: '📅', available: false },
    { id: 'rapidfire', label: 'RapidFire', icon: '⚡', available: false },
  ]

  const leaderboardEntries = useMemo(
    () => data?.leaderboard || [],
    [data]
  )

  const currentData = activeTab === 'global' ? leaderboardEntries : []

  const isCurrentUser = (entry) => {
    if (!user) return false
    return entry.userId === user.id || entry.username === user.username
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className={`min-h-screen relative transition-colors ${themeClasses.bg}`}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <AnimatedBackground variant="default" />
      
      {/* Trophy and medal decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {['🏆', '🥇', '🥈', '🥉', '⭐', '🌟'].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>
      
      <Container className="relative z-10">
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </Button>
            <h1 className={`text-4xl font-header font-bold ${
              themeClasses.isDark ? 'gradient-text' : 'text-electric-purple'
            }`}>
              🏆 Leaderboard
            </h1>
            <div className="w-24" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => tab.available && setActiveTab(tab.id)}
                className="whitespace-nowrap"
                disabled={!tab.available}
              >
                {tab.icon} {tab.label}
                {!tab.available && <span className="ml-1 text-xs opacity-70">(soon)</span>}
              </Button>
            ))}
          </div>

          {/* Leaderboard */}
          <Card className="p-8">
            {isLoading || isFetching ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-16 rounded-lg animate-pulse ${themeClasses.card}`}
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="space-y-4 text-center">
                <p className={`text-lg ${themeClasses.text}`}>Could not load the leaderboard.</p>
                <p className="text-sm text-red-400">{error?.message || 'Unknown error'}</p>
                <Button variant="primary" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center">
                <p className={`text-lg ${themeClasses.text}`}>No leaderboard entries yet.</p>
                {activeTab !== 'global' && (
                  <p className="text-sm text-mint-pop mt-2">This view is coming soon.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {currentData.map((entry, index) => (
                  <motion.div
                    key={`${entry.userId}-${entry.rank}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      flex items-center gap-6 p-6 rounded-lg
                      ${isCurrentUser(entry) 
                        ? 'bg-gradient-purple-mint bg-opacity-20 border-2 border-mint-pop' 
                        : themeClasses.card
                      }
                    `}
                  >
                    <div className="text-3xl font-header font-bold w-16 text-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar user={entry} size="md" />
                    <div className="flex-1">
                      <div className={`text-xl font-header font-bold ${themeClasses.text}`}>
                        {entry.username}
                        {isCurrentUser(entry) && (
                          <span className="ml-2 text-sm text-mint-pop">(You)</span>
                        )}
                      </div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>
                        {entry.gamesPlayed} game{entry.gamesPlayed === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div className="text-2xl font-decorative font-bold text-sunbeam-yellow">
                      {Math.round(entry.topScore || 0).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default Leaderboard
