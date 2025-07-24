import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  type: 'breathing' | 'meditation' | 'visualization';
  instructions: string[];
}

const exercises: Exercise[] = [
  {
    id: 'box-breathing',
    title: '4-7-8 Breathing',
    description: 'A calming breathing technique to reduce anxiety',
    duration: 240, // 4 minutes
    type: 'breathing',
    instructions: [
      'Find a comfortable position and close your eyes',
      'Breathe in through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle'
    ]
  },
  {
    id: 'body-scan',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation focusing on each part of your body',
    duration: 600, // 10 minutes
    type: 'meditation',
    instructions: [
      'Lie down or sit comfortably',
      'Start with your toes and slowly work upward',
      'Notice any tension or sensation in each body part',
      'Breathe into areas of tension',
      'Release and relax each muscle group'
    ]
  },
  {
    id: 'peaceful-place',
    title: 'Peaceful Place Visualization',
    description: 'Imagine a calm, safe place to find inner peace',
    duration: 300, // 5 minutes
    type: 'visualization',
    instructions: [
      'Close your eyes and take deep breaths',
      'Picture a place where you feel completely safe',
      'Notice the colors, sounds, and sensations',
      'Feel the peace and calm of this place',
      'Know you can return here anytime'
    ]
  }
];

const MindfulnessExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);

  const { speak, cancel, speaking } = useSpeechSynthesis();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Completion notification
      speak({ text: 'Exercise complete. Take a moment to notice how you feel.' });
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, speak]);

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedExercise?.type === 'breathing') {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const nextTime = prev + 1;
          
          // 4-7-8 breathing pattern
          if (breathingPhase === 'inhale' && nextTime >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && nextTime >= 7) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && nextTime >= 8) {
            setBreathingPhase('inhale');
            return 0;
          }
          
          return nextTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, breathingPhase, selectedExercise]);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setCurrentStep(0);
    setIsActive(true);
    setBreathingPhase('inhale');
    setPhaseTime(0);
    
    // Speak initial instruction
    speak({ text: `Starting ${exercise.title}. ${exercise.instructions[0]}` });
  };

  const pauseResume = () => {
    setIsActive(!isActive);
    if (speaking) cancel();
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(selectedExercise?.duration || 0);
    setCurrentStep(0);
    setBreathingPhase('inhale');
    setPhaseTime(0);
    cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return `Inhale (${4 - phaseTime})`;
      case 'hold':
        return `Hold (${7 - phaseTime})`;
      case 'exhale':
        return `Exhale (${8 - phaseTime})`;
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 1 + (phaseTime / 4) * 0.3;
      case 'hold':
        return 1.3;
      case 'exhale':
        return 1.3 - (phaseTime / 8) * 0.3;
    }
  };

  return (
    <div className="space-y-6">
      {!selectedExercise ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-mindful bg-clip-text text-transparent mb-4">
              Mindfulness Exercises
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose an exercise to begin your mindful journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass border-0 shadow-soft h-full cursor-pointer hover:shadow-mindful transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl mb-2">{exercise.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{exercise.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="bg-mindful-soft px-2 py-1 rounded-full text-mindful">
                        {exercise.type}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.ceil(exercise.duration / 60)} min
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => startExercise(exercise)}
                      className="w-full btn-mindful"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="glass border-0 shadow-mindful">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl mb-2">{selectedExercise.title}</CardTitle>
              <p className="text-muted-foreground">{selectedExercise.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Timer Display */}
              <div className="text-center">
                <div className="text-4xl font-bold text-mindful mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-mindful rounded-full"
                    style={{
                      width: `${((selectedExercise.duration - timeLeft) / selectedExercise.duration) * 100}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Breathing Animation */}
              {selectedExercise.type === 'breathing' && isActive && (
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-32 h-32 mx-auto bg-gradient-mindful rounded-full flex items-center justify-center"
                    animate={{ scale: getBreathingScale() }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <motion.div
                      className="w-24 h-24 bg-white/30 rounded-full"
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  <div className="text-2xl font-medium text-mindful">
                    {getBreathingInstruction()}
                  </div>
                </div>
              )}

              {/* Meditation Guidance */}
              {selectedExercise.type !== 'breathing' && (
                <div className="text-center space-y-4">
                  <motion.div
                    className="w-24 h-24 mx-auto bg-gradient-calm rounded-full"
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="text-lg text-mindful font-medium">
                        Step {currentStep + 1} of {selectedExercise.instructions.length}
                      </div>
                      <p className="text-foreground text-center max-w-md mx-auto">
                        {selectedExercise.instructions[currentStep]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={pauseResume}
                  variant="outline"
                  size="lg"
                  className="btn-calm"
                >
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={resetExercise}
                  variant="outline"
                  size="lg"
                  className="btn-calm"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={() => {
                    if (selectedExercise.instructions[currentStep]) {
                      speak({ text: selectedExercise.instructions[currentStep] });
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="btn-calm"
                  disabled={speaking}
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Back to exercises */}
              <div className="text-center pt-4 border-t border-border">
                <Button
                  onClick={() => {
                    setSelectedExercise(null);
                    setIsActive(false);
                    cancel();
                  }}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back to Exercises
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MindfulnessExercises;