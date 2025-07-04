import React, { useState } from 'react';
import Background from '@/components/ui/background';
import FloatingAssistant from '@/components/ui/floating-assistant';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultScreen from './ResultScreen';

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

type Screen = 'home' | 'quiz' | 'results';

const QuizApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = (config: QuizConfig) => {
    setQuizConfig(config);
    // Generate mock questions for now - in real app, this would call OpenAI API
    const mockQuestions: Question[] = Array.from({ length: config.numQuestions }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Sample question ${i + 1} about ${config.content}?`,
      options: [
        'Option A',
        'Option B', 
        'Option C',
        'Option D'
      ],
      correctAnswer: Math.floor(Math.random() * 4)
    }));
    
    setQuestions(mockQuestions);
    setCurrentScreen('quiz');
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