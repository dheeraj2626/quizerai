import React, { useState } from 'react';
import Background from '@/components/ui/background';
import FloatingAssistant from '@/components/ui/floating-assistant';
import LoadingScreen from '@/components/ui/loading';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type QuizMode = 'topic' | 'text';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizConfig {
  mode: QuizMode;
  content: string;
  numQuestions: number;
  difficulty: Difficulty;
  participants: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface QuizResult {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  score: number;
  questions: Question[];
}

type Screen = 'home' | 'quiz' | 'results' | 'loading';

const QuizApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartQuiz = async (config: QuizConfig) => {
    setQuizConfig(config);
    setCurrentScreen('loading');
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          mode: config.mode,
          content: config.content,
          numQuestions: config.numQuestions,
          difficulty: config.difficulty
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setQuestions(data.questions);
      setCurrentScreen('quiz');
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
      setCurrentScreen('home');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = (answeredQuestions: Question[]) => {
    const correct = answeredQuestions.filter(q => q.userAnswer === q.correctAnswer).length;
    const incorrect = answeredQuestions.length - correct;
    const score = Math.round((correct / answeredQuestions.length) * 100);

    setResult({
      totalQuestions: answeredQuestions.length,
      correct,
      incorrect,
      score,
      questions: answeredQuestions
    });
    setCurrentScreen('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentScreen('home');
    setQuizConfig(null);
    setQuestions([]);
    setResult(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
      case 'loading':
        return <LoadingScreen message="Generating your AI quiz..." />;
      case 'quiz':
        return questions.length > 0 ? (
          <QuizScreen 
            questions={questions}
            onComplete={handleQuizComplete}
          />
        ) : null;
      case 'results':
        return result ? (
          <ResultScreen 
            result={result}
            onRetake={handleRetakeQuiz}
          />
        ) : null;
      default:
        return <HomeScreen onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <Background>
      {renderScreen()}
      <FloatingAssistant />
    </Background>
  );
};

export default QuizApp;