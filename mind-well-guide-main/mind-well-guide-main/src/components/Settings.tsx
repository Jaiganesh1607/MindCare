import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Palette, 
  Bell, 
  Shield, 
  Trash2, 
  Download,
  Upload,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'light',
    notifications: true,
    soundEnabled: true,
    autoSave: true,
    dataRetention: '30', // days
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('mindcare-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        i18n.changeLanguage(parsed.language);
        
        // Apply theme
        if (parsed.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [i18n]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mindcare-settings', JSON.stringify(settings));
  }, [settings]);

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
    i18n.changeLanguage(language);
    toast({
      title: "Language Updated",
      description: "Language preference has been saved.",
    });
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${theme} mode.`,
    });
  };

  const handleSettingToggle = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    
    const settingNames: Record<string, string> = {
      notifications: 'Notifications',
      soundEnabled: 'Sound',
      autoSave: 'Auto-save'
    };
    
    toast({
      title: `${settingNames[setting]} ${value ? 'Enabled' : 'Disabled'}`,
      description: `${settingNames[setting]} preference has been updated.`,
    });
  };

  const clearAllData = () => {
    // Clear all MindCare data
    const keysToRemove = [
      'mindcare-journal-entries',
      'mindcare-mood-history',
      'mindcare-chat-history',
      'mindcare-user-preferences'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    toast({
      title: "Data Cleared",
      description: "All your personal data has been removed from this device.",
      variant: "destructive"
    });
  };

  const exportData = () => {
    try {
      const data = {
        journalEntries: JSON.parse(localStorage.getItem('mindcare-journal-entries') || '[]'),
        moodHistory: JSON.parse(localStorage.getItem('mindcare-mood-history') || '[]'),
        settings: settings
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindcare-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          {t('settings')}
        </h2>
        <p className="text-muted-foreground text-lg">
          Customize your MindCare experience
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Language & Localization */}
        <Card className="glass border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary" />
              <span>{t('language')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Language</label>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="glass border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-primary" />
              <span>{t('theme')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => handleThemeChange('light')}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${settings.theme === 'light'
                      ? 'border-primary bg-accent shadow-glow'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-sm font-medium">{t('light')}</div>
                </motion.button>
                
                <motion.button
                  onClick={() => handleThemeChange('dark')}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${settings.theme === 'dark'
                      ? 'border-primary bg-accent shadow-glow'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm font-medium">{t('dark')}</div>
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Sound */}
        <Card className="glass border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>{t('notifications')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Daily Check-ins</div>
                  <div className="text-sm text-muted-foreground">
                    Gentle reminders for mood tracking
                  </div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => handleSettingToggle('notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium flex items-center space-x-2">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <span>Sound Effects</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Audio feedback for interactions
                  </div>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingToggle('soundEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-save</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically save your progress
                  </div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingToggle('autoSave', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="glass border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>{t('privacy')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-accent/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Privacy First</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All your data stays on your device. No cloud storage, no tracking.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                
                <Button
                  onClick={clearAllData}
                  variant="outline"
                  className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('clearData')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card className="glass border-0 shadow-soft">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                MindCare
              </h3>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            
            <p className="text-muted-foreground">
              A calm, safe space that listens - developed by Team CODEWICK
            </p>
            
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <span>Privacy-First</span>
              <span>•</span>
              <span>AI-Powered</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;