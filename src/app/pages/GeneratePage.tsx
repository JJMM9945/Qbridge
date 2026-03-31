import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2, CheckCircle, FileText, Brain, Sparkles } from "lucide-react";

export function GeneratePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"analyzing" | "generating" | "complete">("analyzing");
  const fileName = sessionStorage.getItem("pdfFileName") || "문서";

  useEffect(() => {
    // Simulate PDF analysis
    const timer1 = setTimeout(() => {
      setProgress(30);
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(60);
      setStage("generating");
    }, 2000);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStage("complete");
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStartSolving = () => {
    // Generate mock questions and store in sessionStorage
    const questions = [
      {
        id: 1,
        question: "다음 중 프로그래밍에서 변수(Variable)의 역할로 가장 적절한 것은?",
        options: [
          "데이터를 저장하는 메모리 공간",
          "프로그램의 실행 순서를 제어",
          "에러를 처리하는 메커니즘",
          "사용자 입력을 검증하는 도구"
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "객체 지향 프로그래밍의 4대 특징이 아닌 것은?",
        options: [
          "캡슐화 (Encapsulation)",
          "상속성 (Inheritance)",
          "다형성 (Polymorphism)",
          "직렬화 (Serialization)"
        ],
        correctAnswer: 3,
      },
      {
        id: 3,
        question: "다음 중 시간 복잡도가 O(n log n)인 정렬 알고리즘은?",
        options: [
          "버블 정렬",
          "삽입 정렬",
          "병합 정렬",
          "선택 정렬"
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "데이터베이스에서 ACID 속성에 해당하지 않는 것은?",
        options: [
          "원자성 (Atomicity)",
          "일관성 (Consistency)",
          "격리성 (Isolation)",
          "확장성 (Scalability)"
        ],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: "HTTP 프로토콜에서 서버의 리소스를 생성할 때 사용하는 메서드는?",
        options: [
          "GET",
          "POST",
          "PUT",
          "DELETE"
        ],
        correctAnswer: 1,
      },
    ];
    sessionStorage.setItem("questions", JSON.stringify(questions));
    navigate("/solve");
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              {stage === "complete" ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {stage === "complete" ? "문제 생성 완료!" : "문제 생성 중..."}
          </h1>
          <p className="text-gray-600">
            {stage === "analyzing" && "PDF 내용을 분석하고 있습니다"}
            {stage === "generating" && "문제를 생성하고 있습니다"}
            {stage === "complete" && "5개의 문제가 준비되었습니다"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">{progress}%</p>
        </div>

        {/* File Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">분석 중인 파일</p>
            <p className="font-semibold text-gray-900">{fileName}</p>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-3 mb-8">
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            progress >= 30 ? "bg-green-50" : "bg-gray-50"
          }`}>
            <Brain className={`w-5 h-5 ${progress >= 30 ? "text-green-600" : "text-gray-400"}`} />
            <span className={progress >= 30 ? "text-green-900" : "text-gray-600"}>
              PDF 내용 분석
            </span>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            progress >= 60 ? "bg-green-50" : "bg-gray-50"
          }`}>
            <Sparkles className={`w-5 h-5 ${progress >= 60 ? "text-green-600" : "text-gray-400"}`} />
            <span className={progress >= 60 ? "text-green-900" : "text-gray-600"}>
              문제 생성
            </span>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-lg ${
            progress >= 100 ? "bg-green-50" : "bg-gray-50"
          }`}>
            <CheckCircle className={`w-5 h-5 ${progress >= 100 ? "text-green-600" : "text-gray-400"}`} />
            <span className={progress >= 100 ? "text-green-900" : "text-gray-600"}>
              완료
            </span>
          </div>
        </div>

        {/* Start Button */}
        {stage === "complete" && (
          <button
            onClick={handleStartSolving}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            문제 풀기 시작
          </button>
        )}
      </div>
    </div>
  );
}
