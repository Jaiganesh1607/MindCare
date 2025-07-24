import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, Trash2, BookOpen, Calendar, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: Date;
  tags: string[];
}

const EmotionalJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const { t } = useTranslation();

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mindcare-journal-entries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('mindcare-journal-entries', JSON.stringify(entries));
  }, [entries]);

  const moodEmojis: Record<string, string> = {
    'happy': '😊',
    'calm': '😌',
    'excited': '🤩',
    'grateful': '🙏',
    'peaceful': '☮️',
    'sad': '😢',
    'anxious': '😰',
    'angry': '😠',
    'frustrated': '😤',
    'worried': '😟',
    'tired': '😴',
    'confused': '😕',
    'neutral': '😐'
  };

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: editingId || Date.now().toString(),
      title: newEntry.title || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: newEntry.content,
      mood: newEntry.mood || 'neutral',
      date: new Date(),
      tags: newEntry.tags
    };

    if (editingId) {
      setEntries(prev => prev.map(e => e.id === editingId ? entry : e));
      setEditingId(null);
    } else {
      setEntries(prev => [entry, ...prev]);
    }

    // Reset form
    setNewEntry({ title: '', content: '', mood: '', tags: [] });
    setTagInput('');
    setIsWriting(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags
    });
    setEditingId(entry.id);
    setIsWriting(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !newEntry.tags.includes(tagInput.trim())) {
      setNewEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isWriting) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="glass border-0 shadow-mindful">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl bg-gradient-mindful bg-clip-text text-transparent">
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </CardTitle>
            <p className="text-muted-foreground">
              Express your thoughts and feelings in a safe space
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title (optional)</label>
              <Input
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your entry a title..."
                className="border-primary/20 focus:border-primary"
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">How are you feeling?</label>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200 text-center
                      ${newEntry.mood === mood
                        ? 'border-primary bg-accent shadow-glow'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="text-xs font-medium capitalize">{mood}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your thoughts</label>
              <Textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write about your day, your feelings, your thoughts... This is your safe space."
                className="min-h-48 border-primary/20 focus:border-primary text-base leading-relaxed"
              />
              <div className="text-right text-sm text-muted-foreground">
                {newEntry.content.length} characters
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Tags (optional)</label>
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag (e.g., work, family, anxiety)"
                  className="border-primary/20 focus:border-primary"
                />
                <Button onClick={addTag} variant="outline" type="button">
                  Add
                </Button>
              </div>
              
              {newEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newEntry.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                onClick={() => {
                  setIsWriting(false);
                  setEditingId(null);
                  setNewEntry({ title: '', content: '', mood: '', tags: [] });
                  setTagInput('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSaveEntry}
                disabled={!newEntry.content.trim()}
                className="btn-mindful"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-mindful bg-clip-text text-transparent">
            {t('emotionalJournal')}
          </h2>
          <p className="text-muted-foreground mt-2">
            Your private space for reflection and emotional growth
          </p>
        </div>
        
        <Button
          onClick={() => setIsWriting(true)}
          className="btn-hero"
          size="lg"
        >
          <Edit3 className="w-5 h-5 mr-2" />
          Write Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="glass border-0 shadow-soft">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground mb-6">
              Begin documenting your thoughts and feelings to track your emotional growth.
            </p>
            <Button
              onClick={() => setIsWriting(true)}
              className="btn-mindful"
            >
              Write Your First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass border-0 shadow-soft hover:shadow-mindful transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-semibold">
                          {entry.title}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.date)}</span>
                          </div>
                          <span>{formatTime(entry.date)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-accent px-2 py-1 rounded-full">
                          <span className="text-lg">{moodEmojis[entry.mood]}</span>
                          <span className="text-sm font-medium capitalize">{entry.mood}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {entry.content.length > 200 
                        ? `${entry.content.substring(0, 200)}...`
                        : entry.content
                      }
                    </p>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span>{entry.content.length} characters</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditEntry(entry)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteEntry(entry.id)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default EmotionalJournal;