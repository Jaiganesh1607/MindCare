import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
import { chatbot, ChatMessage } from '@/lib/chatbot';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { useTranslation } from 'react-i18next';

interface ChatbotInterfaceProps {
  initialContext?: any;
}

const ChatbotInterface = ({ initialContext }: ChatbotInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const onResult = (result: string) => {
    setInputText(result);
  };

  const { listen, stop, supported } = useSpeechRecognition({
    onResult,
  });

  // Initialize with welcome message
  useEffect(() => {
    const welcomeResponse = chatbot.getWelcomeMessage();
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: welcomeResponse.message,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatbot.sendMessage(userMessage.content, initialContext);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble processing that right now. Can you try again?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startListening = () => {
    setIsRecording(true);
    listen({ continuous: true });
  };

  const stopListening = () => {
    setIsRecording(false);
    stop();
  };

  const speakMessage = (text: string) => {
    if (speaking) {
      cancel();
    } else {
      speak({ text });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      <Card className="glass border-0 shadow-soft flex-1 flex flex-col">
        <CardHeader className="text-center pb-4 border-b border-border">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            {t('chatSupport')}
          </CardTitle>
          <p className="text-muted-foreground">
            Your compassionate AI companion for emotional support
          </p>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white
                      ${message.role === 'user' 
                        ? 'bg-gradient-primary' 
                        : 'bg-gradient-mindful'
                      }
                    `}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`
                      max-w-[70%] p-4 rounded-2xl relative
                      ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-card border border-border'
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                      <span className="text-xs opacity-60">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {message.role === 'assistant' && (
                        <Button
                          onClick={() => speakMessage(message.content)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-mindful flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border pt-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1 space-y-2">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatPlaceholder')}
                  className="min-h-12 max-h-24 resize-none border-primary/20 focus:border-primary"
                  disabled={isLoading}
                />
                
                {/* Recording indicator */}
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-sm text-destructive"
                  >
                    <motion.div
                      className="w-2 h-2 bg-destructive rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span>{t('listening')}</span>
                  </motion.div>
                )}
              </div>

              {/* Voice Control */}
              {supported && (
                <Button
                  onClick={isRecording ? stopListening : startListening}
                  variant={isRecording ? "destructive" : "outline"}
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              )}

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="btn-hero rounded-full w-12 h-12 p-0"
                size="lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotInterface;