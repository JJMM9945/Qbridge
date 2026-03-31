import { Link } from "react-router";
import { FileUp, Brain, PenTool, BarChart3, BookOpen, Sparkles } from "lucide-react";

export function MainPage() {
  const features = [
    {
      icon: <FileUp className="w-8 h-8" />,
      title: "PDF 업로드",
      description: "학습 자료 PDF를 간편하게 업로드하세요",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "자동 문제 생성",
      description: "AI가 PDF 내용을 분석하여 문제를 생성합니다",
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "문제 풀이",
      description: "생성된 문제를 풀며 학습 내용을 복습하세요",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "학습 통계",
      description: "학습 진도와 성취도를 한눈에 확인하세요",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            큐브릿지
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            PDF 학습 자료를 업로드하면 AI가 자동으로 문제를 생성합니다
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-6 h-6" />
            시작하기
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}