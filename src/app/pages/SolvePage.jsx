import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";


export function SolvePage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  const handleSelectAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Store answers for result page
    sessionStorage.setItem("answers", JSON.stringify(answers));
    navigate("/result");
  };

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">진행 상황</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">
                {answeredCount} / {questions.length}
              </span>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition ${
                  answers[index] !== undefined
                    ? "bg-green-500"
                    : index === currentIndex
                    ? "bg-indigo-500"
                    
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              문제 {currentIndex + 1}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleSelectAnswer(optionIndex)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[currentIndex] === optionIndex
                    ? "border-indigo-500 bg-indigo-50"
                    
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentIndex] === optionIndex
                        ? "border-indigo-500 bg-indigo-500"
                        
                    }`}
                  >
                    {answers[currentIndex] === optionIndex && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  answeredCount < questions.length
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    
                }`}
              >
                제출하기
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                다음
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}