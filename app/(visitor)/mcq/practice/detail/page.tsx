"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  Award
} from "lucide-react";
import { dbGet, dbGetById } from "@/lib/db";
import confetti from "canvas-confetti";

function MCQPracticeEngineContent() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("id") || "";

  const [questions, setQuestions] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  // Quiz Engine States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default (600s)
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      
      // Determine Subject Name & Questions
      let subjectTitle = "Practice Quiz";
      let rawQuestions: any[] = [];

      if (subjectId === "daily-quiz") {
        subjectTitle = "Daily GK & Current Affairs Quiz";
        rawQuestions = await dbGet("mcqs");
        // Limit to 5 questions for daily test
        rawQuestions = rawQuestions.slice(0, 5);
      } else if (subjectId === "full-mock") {
        subjectTitle = "Full Syllabus Mock Test";
        rawQuestions = await dbGet("mcqs");
        // Limit to 10 questions for quick mock
        rawQuestions = rawQuestions.slice(0, 10);
        setTimeRemaining(1200); // 20 minutes for full mock
      } else {
        const sub = await dbGetById("subjects", subjectId);
        subjectTitle = sub?.name || "Practice Quiz";
        const allMcqs = await dbGet("mcqs");
        rawQuestions = allMcqs.filter((q: any) => q.subjectId === subjectId);
      }

      setSubjectName(subjectTitle);
      
      // Randomize / Shuffle Questions
      const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setLoading(false);
    };

    loadQuiz();
  }, [subjectId]);

  // Countdown Timer
  useEffect(() => {
    if (loading || quizFinished || !timerActive || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, quizFinished, timerActive, questions]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOpt(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === questions[currentIdx].answerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      setTimerActive(false);
      
      // Trigger Confetti if high score!
      const percentage = (score / questions.length) * 100;
      if (percentage >= 50) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRetry = () => {
    // Re-shuffle and reset
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setTimeRemaining(subjectId === "full-mock" ? 1200 : 600);
    setTimeSpent(0);
    setQuizFinished(false);
    setTimerActive(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-slate-500">Loading quiz questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-800">No Questions Configured</h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          There are no MCQ questions available in this category yet. Return to the home screen or log in as an Admin to add MCQs.
        </p>
        <Link href="/mcq" className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-md block">
          Back to Practice Hub
        </Link>
      </div>
    );
  }

  const activeQuestion = questions[currentIdx];
  const progressPercent = ((currentIdx) / questions.length) * 100;
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {subjectName}
          </span>
          <h1 className="text-lg sm:text-xl font-black text-primary-dark tracking-tight">
            Question {currentIdx + 1} of {questions.length}
          </h1>
        </div>

        {/* Timer */}
        <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 w-fit">
          <Clock className="w-4 h-4 text-primary" />
          <span>Timer: {formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Container */}
      {!quizFinished ? (
        <div className="space-y-6 animate-fade-in">
          {/* Question Text */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white space-y-6">
            <h2 className="text-base sm:text-lg font-black text-slate-800 leading-relaxed">
              {activeQuestion.question}
            </h2>

            {/* Options group */}
            <div className="space-y-3.5">
              {activeQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedOpt === index;
                const isCorrectIndex = index === activeQuestion.answerIndex;
                
                let optionStyle = "border-slate-200 hover:border-primary hover:bg-slate-50";
                let badgeStyle = "bg-slate-100 text-slate-600";
                
                if (isAnswered) {
                  if (isCorrectIndex) {
                    optionStyle = "border-green-500 bg-green-50/70 text-green-900";
                    badgeStyle = "bg-green-500 text-white";
                  } else if (isSelected) {
                    optionStyle = "border-red-500 bg-red-50/70 text-red-900";
                    badgeStyle = "bg-red-500 text-white";
                  } else {
                    optionStyle = "border-slate-100 opacity-60 text-slate-400";
                    badgeStyle = "bg-slate-100 text-slate-300";
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center space-x-3 transition-all font-semibold text-sm ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${badgeStyle}`}>
                      {letters[index]}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="glass-card p-6 rounded-3xl border-l-4 border-l-primary bg-primary/5 border border-white animate-fade-in space-y-2">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span>Question Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                {activeQuestion.explanation || "No explanation provided for this question."}
              </p>
            </div>
          )}

          {/* Controls */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center space-x-2"
            >
              <span>{currentIdx < questions.length - 1 ? "Next Question" : "Complete Quiz"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Results canvas */
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white text-center space-y-6 animate-fade-in">
          <Trophy className="w-16 h-16 text-accent mx-auto animate-float" />
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-primary-dark">Practice Completed!</h2>
            <p className="text-xs text-slate-500 font-semibold">Your evaluation details for {subjectName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Final Score</span>
              <span className="text-2xl font-black text-slate-800">{score} / {questions.length}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Accuracy</span>
              <span className="text-2xl font-black text-slate-800">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleRetry}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-bold shadow-md flex items-center justify-center space-x-2 text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <Link
              href="/mcq"
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3.5 rounded-xl font-bold shadow-sm flex items-center justify-center text-sm transition-colors"
            >
              <span>Back to Hub</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MCQPracticeEngine() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading quiz questions...</div>}>
      <MCQPracticeEngineContent />
    </Suspense>
  );
}
