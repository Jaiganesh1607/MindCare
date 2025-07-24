import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  Activity, 
  Mic, 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Settings,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    const settings = JSON.parse(localStorage.getItem('mindcare-settings') || '{}');
    settings.language = language;
    localStorage.setItem('mindcare-settings', JSON.stringify(settings));
  };
  
  const languageOptions = [
    { value: 'en', label: 'EN', flag: '🇺🇸' },
    { value: 'hi', label: 'हि', flag: '🇮🇳' },
    { value: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'mood-tracker', label: t('moodTracker'), icon: Activity },
    { id: 'voice-input', label: t('voiceInput'), icon: Mic },
    { id: 'journal', label: t('journal'), icon: BookOpen },
    { id: 'mindfulness', label: t('mindfulness'), icon: Brain },
    { id: 'chatbot', label: t('chatbot'), icon: MessageCircle },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-40"
      >
        <div className="glass rounded-2xl p-4 space-y-3 shadow-mindful">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleNavClick(item.id)}
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  className={`
                    w-14 h-14 rounded-xl p-0 relative group
                    ${isActive 
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <IconComponent className="w-6 h-6" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Menu Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 left-4 z-50"
        >
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
            size="lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </motion.div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80 glass p-6 shadow-mindful"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-16 space-y-4">
                {/* App Header with Language Switcher */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full" />
                    <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                      {t('appName')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Select value={i18n.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">{option.flag}</span>
                              <span className="text-xs">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleNavClick(item.id)}
                        variant={isActive ? "default" : "ghost"}
                        size="lg"
                        className={`
                          w-full justify-start text-left h-14 rounded-xl
                          ${isActive 
                            ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                          }
                        `}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bottom Mobile Navigation */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 z-30"
        >
          <div className="glass rounded-2xl p-4 shadow-mindful">
            <div className="flex justify-around">
              {navItems.slice(0, 5).map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleNavClick(item.id)}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`
                        w-12 h-12 rounded-xl p-0
                        ${isActive 
                          ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Navigation;