import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { QuizConfig, QuizMode, Difficulty } from './QuizApp';
import { Brain, Sparkles, Users } from 'lucide-react';

interface HomeScreenProps {
  onStartQuiz: (config: QuizConfig) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz }) => {
  const [mode, setMode] = useState<QuizMode>('topic');
  const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [participants, setParticipants] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onStartQuiz({
        mode,
        content: content.trim(),
        numQuestions,
        difficulty,
        participants
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <Brain className="w-16 h-16 mx-auto mb-4 text-primary floating-animation" />
            <div className="absolute inset-0 w-16 h-16 mx-auto mb-4 neon-glow rounded-full opacity-30"></div>
          </div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            AI Quiz Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create dynamic quizzes powered by artificial intelligence
          </p>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-8">
          {/* Mode Toggle */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quiz Mode
            </Label>
            <div className="flex items-center space-x-4 p-4 glass-card rounded-xl">
              <div className="flex items-center space-x-2">
                <Switch
                  id="mode-toggle"
                  checked={mode === 'text'}
                  onCheckedChange={(checked) => setMode(checked ? 'text' : 'topic')}
                />
                <Label htmlFor="mode-toggle" className="text-sm">
                  {mode === 'topic' ? 'Topic Mode' : 'Text Mode'}
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">
                {mode === 'topic' 
                  ? 'Generate questions from a topic' 
                  : 'Generate questions from your text'
                }
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-4">
            <Label htmlFor="content" className="text-lg font-semibold">
              {mode === 'topic' ? 'Enter Topic' : 'Enter Text Content'}
            </Label>
            {mode === 'topic' ? (
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., Machine Learning, History of Rome, React Hooks..."
                className="glass-card border-glass-border bg-glass text-lg p-4 h-14"
                required
              />
            ) : (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text content here..."
                className="glass-card border-glass-border bg-glass min-h-[120px] text-base p-4"
                required
              />
            )}
          </div>

          {/* Quiz Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Number of Questions */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Questions</Label>
              <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
                <SelectTrigger className="glass-card border-glass-border bg-glass h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border bg-glass">
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                <SelectTrigger className="glass-card border-glass-border bg-glass h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border bg-glass">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Participants */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Players
              </Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                className="glass-card border-glass-border bg-glass h-12"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            type="submit" 
            variant="neon"
            size="lg"
            className="w-full h-14 text-lg font-semibold pulse-glow"
          >
            Generate Quiz
            <Brain className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HomeScreen;