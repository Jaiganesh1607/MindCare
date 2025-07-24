import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MoodTrackerProps {
  onMoodSubmit: (mood: { emotion: string; intensity: number; timestamp: Date }) => void;
}

const emotions = [
  { emoji: '😊', label: 'Happy', color: 'bg-emotions-peaceful' },
  { emoji: '😌', label: 'Calm', color: 'bg-emotions-calm' },
  { emoji: '😐', label: 'Neutral', color: 'bg-muted' },
  { emoji: '😟', label: 'Worried', color: 'bg-emotions-stressed' },
  { emoji: '😢', label: 'Sad', color: 'bg-destructive' },
  { emoji: '😤', label: 'Frustrated', color: 'bg-emotions-energetic' },
  { emoji: '😴', label: 'Tired', color: 'bg-muted-foreground' },
  { emoji: '🤗', label: 'Grateful', color: 'bg-growth' },
];

const MoodTracker = ({ onMoodSubmit }: MoodTrackerProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState([5]);

  const handleSubmit = () => {
    if (selectedEmotion) {
      onMoodSubmit({
        emotion: selectedEmotion,
        intensity: intensity[0],
        timestamp: new Date()
      });
    }
  };

  const getIntensityText = (value: number) => {
    if (value <= 3) return 'Mild';
    if (value <= 7) return 'Moderate';
    return 'Intense';
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return 'text-growth';
    if (value <= 7) return 'text-emotions-energetic';
    return 'text-destructive';
  };

  return (
    <Card className="glass border-0 shadow-soft">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          How are you feeling?
        </CardTitle>
        <p className="text-muted-foreground">
          Select your current emotion and intensity
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Emotion Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">Choose your emotion</h3>
          <div className="grid grid-cols-4 gap-3">
            {emotions.map((emotion) => (
              <motion.button
                key={emotion.label}
                onClick={() => setSelectedEmotion(emotion.label)}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300
                  ${selectedEmotion === emotion.label 
                    ? 'border-primary shadow-glow bg-accent' 
                    : 'border-border hover:border-primary/50 bg-card'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{emotion.emoji}</div>
                <div className="text-xs font-medium">{emotion.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Intensity Slider */}
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Intensity Level</h3>
              <div className={`text-2xl font-bold ${getIntensityColor(intensity[0])}`}>
                {getIntensityText(intensity[0])} ({intensity[0]}/10)
              </div>
            </div>

            <div className="px-4">
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full btn-hero text-lg py-6"
              size="lg"
            >
              Submit Mood Check-in
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;