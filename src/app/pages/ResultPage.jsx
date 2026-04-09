import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trophy, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Home } from "lucide-react";


export function ResultPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("questions");
    const storedAnswers = sessionStorage.getItem("answers");
    const storedTime = sessionStorage.getItem("timeElapsed");

    if (storedQuestions && storedAnswers) {
      setQuestions(JSON.parse(storedQuestions));
      setAnswers(JSON.parse(storedAnswers));
      setTimeElapsed(parseInt(storedTime || "0"));

      // Save to statistics
      saveToStatistics(JSON.parse(storedQuestions), JSON.parse(storedAnswers));
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  const saveToStatistics = (qs, ans) => {
    const correctCount = qs.filter((q, idx) => ans[idx] === q.correctAnswer).length;
    const stats = JSON.parse(sessionStorage.getItem("statistics") || "[]");
    
    // Mock chapter data
    const chapter = `Chapter ${Math.floor(Math.random() * 5) + 1}`;
    
    stats.push({
      date: new Date().toISOString(),
      score: correctCount,
      total: qs.length,
      chapter: chapter,
    });
    sessionStorage.setItem("statistics", JSON.stringify(stats));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const correctCount = questions.filter(
    (q, idx) => answers[idx] === q.correctAnswer
  ).length;
  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = () => {
    if (scorePercentage >= 80) return "bg-green-100";
    if (scorePercentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className={`w-20 h-20 ${getScoreBg()} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Trophy className={`w-12 h-12 ${getScoreColor()}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">시험 완료!</h1>
          <div className={`text-6xl font-bold ${getScoreColor()} mb-4`}>
            {scorePercentage}점
          </div>
          <p className="text-xl text-gray-600 mb-6">
            {correctCount} / {questions.length} 문제 정답
          </p>

          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>정답: {correctCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>오답: {questions.length - correctCount}</span>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상세 결과 및 해설</h2>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={question.id}
                  className={`border-2 rounded-lg overflow-hidden ${
                    isCorrect ? "border-green-200" 
                  }`}
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-gray-900 text-left">
                        문제 {index + 1}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t">
                      <p className="text-gray-900 font-semibold mb-4">{question.question}</p>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = answers[index] === optionIndex;
                          const isCorrectAnswer = question.correctAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer
                                  ? "bg-green-100 border border-green-300"
                                  : isUserAnswer
                                  ? "bg-red-100 border border-red-300"
                                  
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-900">{option}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">💡 해설</p>
                        <p className="text-sm text-blue-800">
                          정답은 "{question.options[question.correctAnswer]}"입니다. 
                          이 개념은 학습 자료의 핵심 내용 중 하나이므로, 
                          다시 한번 복습하시는 것을 권장합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            <Home className="w-5 h-5" />
            메인으로
          </button>
          <button
            onClick={() => navigate("/statistics")}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            학습 통계 보기
          </button>
        </div>
      </div>
    </div>
  );
}