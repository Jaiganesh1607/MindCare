import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Send, Volume2, AlertCircle } from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { useToast } from '@/components/ui/use-toast';

interface VoiceInputProps {
  onTextSubmit: (text: string) => void;
  isProcessing?: boolean;
}

const VoiceInput = ({ onTextSubmit, isProcessing = false }: VoiceInputProps) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const onResult = useCallback((result: string) => {
    setText(result);
    setHasError(false);
    setErrorCount(0);
  }, []);

  const onError = useCallback((event: any) => {
    console.warn('Speech recognition issue:', event.type || 'Unknown error');
    
    // Handle specific error types
    const errorType = event.error || event.type;
    
    if (errorType === 'not-allowed' || errorType === 'not-found') {
      setHasError(true);
      setIsRecording(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice input. You can type instead if needed.",
        variant: "destructive"
      });
      return;
    }
    
    setErrorCount(prev => prev + 1);
    
    // If too many errors, show a helpful message
    if (errorCount >= 2) {
      setHasError(true);
      setIsRecording(false);
      toast({
        title: "Voice Recognition Issue",
        description: "Having trouble with voice input. Please try typing instead or check your microphone permissions.",
        variant: "destructive"
      });
      
      // Reset error count after a delay
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(() => {
        setErrorCount(0);
        setHasError(false);
      }, 5000);
    }
  }, [errorCount, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const { listen, stop, supported } = useSpeechRecognition({
    onResult,
    onError,
  });

  const startListening = useCallback(async () => {
    try {
      // Check microphone permissions first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setHasError(false);
      listen({ 
        continuous: true, 
        interimResults: true,
        lang: 'en-US' // Can be made dynamic based on app language
      });
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive"
      });
    }
  }, [listen, toast]);

  const stopListening = useCallback(() => {
    setIsRecording(false);
    stop();
  }, [stop]);

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
      setText('');
    }
  };

  const speakText = () => {
    if (text.trim()) {
      speak({ text: text });
    }
  };

  return (
    <Card className="glass border-0 shadow-soft">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl bg-gradient-mindful bg-clip-text text-transparent">
          Share Your Thoughts
        </CardTitle>
        <p className="text-muted-foreground">
          Type or speak about how you're feeling
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input */}
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell me about your day, your feelings, or what's on your mind..."
            className="min-h-32 resize-none border-primary/20 focus:border-primary text-base"
            disabled={isProcessing}
          />
          
          {/* Character count */}
          <div className="text-right">
            <span className="text-sm text-muted-foreground">
              {text.length} characters
            </span>
          </div>
        </div>

        {/* Voice Controls */}
        {supported && (
          <div className="flex justify-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isRecording ? stopListening : startListening}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className={`
                  rounded-full w-16 h-16 p-0 transition-all duration-300
                  ${isRecording 
                    ? 'bg-destructive hover:bg-destructive/90 animate-gentle-pulse' 
                    : hasError 
                    ? 'border-destructive text-destructive hover:bg-destructive/10'
                    : 'btn-mindful hover:shadow-glow'
                  }
                `}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <MicOff className="w-6 h-6" />
                ) : hasError ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            </motion.div>

            {text && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={speakText}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-16 h-16 p-0 btn-calm"
                  disabled={speaking || isProcessing}
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Status Indicators */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-destructive">
              <motion.div
                className="w-3 h-3 bg-destructive rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Speak naturally, I'm here to listen
            </p>
          </motion.div>
        )}

        {hasError && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Voice input temporarily unavailable</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please try typing or check your microphone settings
            </p>
          </motion.div>
        )}

        {!supported && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Voice input not supported in this browser</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please use the text input above
            </p>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isProcessing}
          className="w-full btn-hero text-lg py-6 focus-ring"
          size="lg"
        >
          {isProcessing ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Processing...</span>
            </motion.div>
          ) : (
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Share Your Thoughts</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VoiceInput;