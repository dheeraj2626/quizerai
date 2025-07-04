import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Question } from './QuizApp';
import { ChevronRight, Clock } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (questions: Question[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([...questions]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = answeredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      // Update the current question with user's answer
      const updatedQuestions = [...answeredQuestions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: selectedAnswer
      };
      setAnsweredQuestions(updatedQuestions);

      if (isLastQuestion) {
        // Complete the quiz
        onComplete(updatedQuestions);
      } else {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      }
    }
  };

  const getOptionVariant = (optionIndex: number) => {
    if (selectedAnswer === optionIndex) {
      return 'neon';
    }
    return 'glass';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="glass-card p-4 rounded-xl">
            <Progress 
              value={progress} 
              className="h-3 mb-2" 
            />
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={getOptionVariant(index)}
                size="lg"
                onClick={() => handleAnswerSelect(index)}
                className="h-auto p-6 text-left justify-start text-wrap transition-bounce hover:scale-105"
              >
                <div className="flex items-start gap-4 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base leading-relaxed">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            variant="neon"
            size="lg"
            className="px-8 h-12 font-semibold"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Question Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentQuestionIndex
                  ? 'bg-success'
                  : index === currentQuestionIndex
                  ? 'bg-primary neon-glow'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;