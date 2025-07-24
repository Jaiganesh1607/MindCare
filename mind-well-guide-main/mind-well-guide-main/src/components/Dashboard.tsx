import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Award,
  Activity,
  BookOpen,
  Brain,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

interface StreakData {
  current: number;
  best: number;
  lastCheckin: Date | null;
}

interface MoodData {
  emotion: string;
  intensity: number;
  date: Date;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { t } = useTranslation();
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, lastCheckin: null });
  const [recentMoods, setRecentMoods] = useState<MoodData[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [todaysQuote] = useState(getDailyQuote());

  // Load user data
  useEffect(() => {
    // Load streak data
    const streakData = localStorage.getItem('mindcare-streak');
    if (streakData) {
      try {
        const parsed = JSON.parse(streakData);
        setStreak({
          ...parsed,
          lastCheckin: parsed.lastCheckin ? new Date(parsed.lastCheckin) : null
        });
      } catch (error) {
        console.error('Error loading streak data:', error);
      }
    }

    // Load recent moods
    const moodHistory = localStorage.getItem('mindcare-mood-history');
    if (moodHistory) {
      try {
        const parsed = JSON.parse(moodHistory);
        setRecentMoods(parsed.slice(0, 7).map((mood: any) => ({
          ...mood,
          date: new Date(mood.timestamp)
        })));
      } catch (error) {
        console.error('Error loading mood history:', error);
      }
    }

    // Load journal count
    const journalEntries = localStorage.getItem('mindcare-journal-entries');
    if (journalEntries) {
      try {
        const parsed = JSON.parse(journalEntries);
        setJournalCount(parsed.length);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  const quickActions = [
    {
      id: 'mood-tracker',
      title: 'Quick Mood Check',
      description: 'How are you feeling right now?',
      icon: Heart,
      color: 'bg-gradient-primary',
      action: () => onNavigate('mood-tracker')
    },
    {
      id: 'voice-input',
      title: 'Voice Session',
      description: 'Share your thoughts aloud',
      icon: Activity,
      color: 'bg-gradient-mindful',
      action: () => onNavigate('voice-input')
    },
    {
      id: 'mindfulness',
      title: 'Mindful Moment',
      description: 'Take a breathing break',
      icon: Brain,
      color: 'bg-gradient-calm',
      action: () => onNavigate('mindfulness')
    },
    {
      id: 'journal',
      title: 'Journal Entry',
      description: 'Write about your day',
      icon: BookOpen,
      color: 'bg-gradient-primary',
      action: () => onNavigate('journal')
    }
  ];

  const achievements = [
    { 
      title: 'First Step', 
      description: 'Completed your first mood check-in',
      earned: recentMoods.length > 0,
      icon: '🎯'
    },
    { 
      title: 'Consistent Care', 
      description: 'Maintained a 3-day streak',
      earned: streak.current >= 3,
      icon: '🔥'
    },
    { 
      title: 'Reflection Master', 
      description: 'Written 5+ journal entries',
      earned: journalCount >= 5,
      icon: '📝'
    },
    { 
      title: 'Mindful Warrior', 
      description: 'Completed 10+ mindfulness sessions',
      earned: false, // This would track mindfulness sessions
      icon: '🧘'
    }
  ];

  const moodEmojis: Record<string, string> = {
    'happy': '😊', 'calm': '😌', 'excited': '🤩', 'grateful': '🙏',
    'sad': '😢', 'anxious': '😰', 'angry': '😠', 'frustrated': '😤',
    'tired': '😴', 'neutral': '😐', 'worried': '😟'
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDaysUntilGoal = () => {
    // Simple goal: check in for 7 consecutive days
    return Math.max(0, 7 - streak.current);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {getWelcomeMessage()}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to your mindful space
          </p>
        </div>

        {/* Daily Quote */}
        <Card className="glass border-0 shadow-soft max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div className="text-center">
                <p className="text-lg italic text-foreground leading-relaxed">
                  "{todaysQuote.text}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  — {todaysQuote.author}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="w-5 h-5 text-growth" />
                <span>Current Streak</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-growth">
                  {streak.current} days
                </div>
                <div className="text-sm text-muted-foreground">
                  Best: {streak.best} days
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <BookOpen className="w-5 h-5 text-mindful" />
                <span>Journal Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-mindful">
                  {journalCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total entries written
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-0 shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Target className="w-5 h-5 text-primary" />
                <span>Weekly Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {Math.max(0, 7 - getDaysUntilGoal())}/7
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDaysUntilGoal() === 0 ? 'Goal achieved!' : `${getDaysUntilGoal()} days to go`}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
               <Card 
                className="glass border-0 shadow-soft cursor-pointer hover:shadow-mindful hover-lift focus-ring transition-all duration-300"
                onClick={action.action}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    action.action();
                  }
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mx-auto shadow-glow`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 mx-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Moods</h2>
          <Card className="glass border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                {recentMoods.map((mood, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex flex-col items-center space-y-2 min-w-[80px]"
                  >
                    <div className="text-3xl">
                      {moodEmojis[mood.emotion] || '😐'}
                    </div>
                    <div className="text-xs font-medium capitalize">
                      {mood.emotion}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {mood.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Button
                  onClick={() => onNavigate('mood-tracker')}
                  variant="outline"
                  size="sm"
                >
                  View All Moods
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`
                glass border-0 shadow-soft transition-all duration-300
                ${achievement.earned ? 'bg-accent/50 shadow-glow' : 'opacity-60'}
              `}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-growth text-growth-foreground">
                      Earned!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Daily inspirational quotes
function getDailyQuote() {
  const quotes = [
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha"
    },
    {
      text: "Your mental health is more important than your career, money, other's opinions, that event you said you'd attend, your partner's mood, and your family's opinions. Take care of yourself.",
      author: "Unknown"
    },
    {
      text: "Self-care is not selfish. It is essential.",
      author: "Audre Lorde"
    },
    {
      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious. Having feelings doesn't make you a negative person.",
      author: "Lori Deschene"
    },
    {
      text: "Be kind to your mind. It's the only one you've got.",
      author: "Unknown"
    },
    {
      text: "You are enough just as you are. Each emotion you feel, everything in your life, everything you do or do not do... where you are and who you are right now is enough.",
      author: "Haemin Sunim"
    },
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer"
    }
  ];

  // Get a quote based on the day of the year for consistency
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

export default Dashboard;