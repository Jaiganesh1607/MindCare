import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50"
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <motion.div
              className="w-16 h-16 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          {/* Floating Circles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/30 rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${15 + i * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            MindCare
          </h1>
          <p className="text-white/80 text-lg font-medium">
            A calm, safe space that listens
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-64 mx-auto"
        >
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-white/60 text-sm mt-3">
            Preparing your mindful space...
          </p>
        </motion.div>

        {/* Team Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <p className="text-white/50 text-sm">
            Developed by Team CODEWICK
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;