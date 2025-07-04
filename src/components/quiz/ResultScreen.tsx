import React from 'react';
import { Button } from '@/components/ui/button';
import { QuizResult } from './QuizApp';
import { Trophy, RotateCcw, CheckCircle, XCircle, Award } from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onRetake: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetake }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Excellent work! 🎉';
    if (score >= 70) return 'Great job! 👏';
    if (score >= 60) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-primary floating-animation" />
            <div className="absolute inset-0 w-20 h-20 mx-auto mb-4 neon-glow rounded-full opacity-40"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Quiz Complete!
          </h1>
          <p className="text-xl text-muted-foreground">
            {getScoreMessage(result.score)}
          </p>
        </div>

        {/* Score Card */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl md:text-7xl font-bold mb-4 ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <div className="text-2xl font-semibold text-muted-foreground">
              Your Score
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-2">{result.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div className="text-3xl font-bold mb-2 text-success">{result.correct}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>

            <div className="glass-card rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-3xl font-bold mb-2 text-destructive">{result.incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorrect Answers</div>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Question Review</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.questions.map((question, index) => {
              const isCorrect = question.userAnswer === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`glass-card rounded-xl p-4 border-l-4 ${
                    isCorrect ? 'border-l-success' : 'border-l-destructive'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-2">
                        Question {index + 1}: {question.question}
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">
                          Your answer: <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                            {question.options[question.userAnswer || 0]}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-muted-foreground">
                            Correct answer: <span className="text-success">
                              {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRetake}
            variant="neon"
            size="lg"
            className="px-8 h-12 font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Another Quiz
          </Button>
          <Button
            variant="glass"
            size="lg"
            className="px-8 h-12 font-semibold"
            onClick={() => navigator.share?.({ 
              title: 'AI Quiz Results', 
              text: `I scored ${result.score}% on an AI-generated quiz!` 
            })}
          >
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;