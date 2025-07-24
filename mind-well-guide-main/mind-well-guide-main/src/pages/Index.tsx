import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';

// Components
import SplashScreen from '@/components/SplashScreen';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import MoodTracker from '@/components/MoodTracker';
import VoiceInput from '@/components/VoiceInput';
import EmotionalJournal from '@/components/EmotionalJournal';
import MindfulnessExercises from '@/components/MindfulnessExercises';
import ChatbotInterface from '@/components/ChatbotInterface';
import Settings from '@/components/Settings';
import VoiceChatFrame from '@/components/VoiceChatFrame';

// Services
import { initializeSentimentAnalysis, analyzeSentiment } from '@/lib/sentiment';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentContext, setSentimentContext] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Initialize AI models
  useEffect(() => {
    const initializeAI = async () => {
      await initializeSentimentAnalysis();
    };
    initializeAI();
  }, []);

  const handleMoodSubmit = async (mood: any) => {
    // Save mood to local storage
    const moodHistory = JSON.parse(localStorage.getItem('mindcare-mood-history') || '[]');
    moodHistory.unshift(mood);
    localStorage.setItem('mindcare-mood-history', JSON.stringify(moodHistory.slice(0, 100)));

    // Update streak
    const today = new Date().toDateString();
    const streak = JSON.parse(localStorage.getItem('mindcare-streak') || '{"current": 0, "best": 0, "lastCheckin": null}');
    
    if (!streak.lastCheckin || new Date(streak.lastCheckin).toDateString() !== today) {
      streak.current += 1;
      streak.best = Math.max(streak.best, streak.current);
      streak.lastCheckin = new Date();
      localStorage.setItem('mindcare-streak', JSON.stringify(streak));
    }

    toast({
      title: "Mood Recorded",
      description: `Thank you for sharing that you're feeling ${mood.emotion}.`,
    });

    setCurrentView('home');
  };

  const handleTextSubmit = async (text: string) => {
    setIsLoading(true);
    try {
      const sentiment = await analyzeSentiment(text);
      setSentimentContext(sentiment);
      
      // Navigate to chatbot for response
      setCurrentView('chatbot');
      
      toast({
        title: "Analysis Complete",
        description: "I've analyzed your message. Let's talk about it.",
      });
    } catch (error) {
      console.error('Text analysis error:', error);
      toast({
        title: "Processing Complete",
        description: "Thank you for sharing. Let's continue our conversation.",
        variant: "default"
      });
      setCurrentView('chatbot');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mood-tracker':
        return <MoodTracker onMoodSubmit={handleMoodSubmit} />;
      case 'voice-input':
        return <VoiceInput onTextSubmit={handleTextSubmit} isProcessing={isLoading} />;
      case 'journal':
        return <EmotionalJournal />;
      case 'mindfulness':
        return <MindfulnessExercises />;
      case 'chatbot':
        return <ChatbotInterface initialContext={sentimentContext} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="lg:ml-20 p-4 lg:p-8 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <VoiceChatFrame />
    </div>
  );
};

export default Index;
