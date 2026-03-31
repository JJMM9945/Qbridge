import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";
import { TrendingUp, Award, FileText, ArrowLeft, BookOpen, Target, Clock } from "lucide-react";

interface StatEntry {
  date: string;
  score: number;
  total: number;
  chapter: string;
}

export function StatisticsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatEntry[]>([]);

  useEffect(() => {
    const storedStats = sessionStorage.getItem("statistics");
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 전체 통계
  const totalTests = stats.length;
  const totalQuestions = stats.reduce((sum, stat) => sum + stat.total, 0);
  const totalCorrect = stats.reduce((sum, stat) => sum + stat.score, 0);
  const averageScore = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  // 정답률 추이 데이터
  const scoreData = stats.map((stat, index) => ({
    name: `시험 ${index + 1}`,
    정답률: Math.round((stat.score / stat.total) * 100),
    date: formatDate(stat.date),
  }));

  // 단원별 정답률 계산
  const chapterStats = stats.reduce((acc: any, stat) => {
    if (!acc[stat.chapter]) {
      acc[stat.chapter] = { total: 0, correct: 0 };
    }
    acc[stat.chapter].total += stat.total;
    acc[stat.chapter].correct += stat.score;
    return acc;
  }, {});

  const chapterData = Object.keys(chapterStats).map((chapter) => ({
    chapter,
    정답률: Math.round((chapterStats[chapter].correct / chapterStats[chapter].total) * 100),
    정답수: chapterStats[chapter].correct,
    총문제수: chapterStats[chapter].total,
  }));

  // 단원별 진도율 (문제 푼 비율)
  const totalChapterQuestions = 20; // Mock: 각 챕터당 총 문제 수
  const progressData = chapterData.map((data) => ({
    chapter: data.chapter,
    진도율: Math.min(Math.round((data.총문제수 / totalChapterQuestions) * 100), 100),
  }));

  // 레이더 차트용 데이터 (단원별 성취도)
  const radarData = chapterData.map((data) => ({
    subject: data.chapter,
    score: data.정답률,
  }));

  // 정답/오답 비율
  const pieData = [
    { name: "정답", value: totalCorrect, color: "#10b981" },
    { name: "오답", value: totalQuestions - totalCorrect, color: "#ef4444" },
  ];

  // Mock 학습 시간 데이터 (단원별)
  const studyTimeData = chapterData.map((data) => ({
    chapter: data.chapter,
    학습시간: Math.floor(Math.random() * 60) + 30, // Mock: 30-90분
  }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">학습 통계</h1>
        </div>

        {stats.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">아직 학습 기록이 없습니다</p>
            <p className="text-gray-500 mb-6">문제를 풀고 학습 통계를 확인해보세요!</p>
            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              문제 풀러 가기
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">평균 점수</span>
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">총 시험 수</span>
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalTests}회</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">총 문제 수</span>
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalQuestions}개</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">학습 단원</span>
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{chapterData.length}개</p>
              </div>
            </div>

            {/* 정답률 추이 & 정답/오답 비율 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">정답률 추이</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="정답률"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ fill: "#4f46e5", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">정답/오답 비율</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 단원별 정답률 & 진도율 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">단원별 정답률</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chapterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="chapter" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="정답률" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">단원별 진도율</h2>
                </div>
                <div className="space-y-4 pt-4">
                  {progressData.map((data, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{data.chapter}</span>
                        <span className="text-indigo-600 font-bold">{data.진도율}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                          style={{ width: `${data.진도율}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 레이더 차트 & 학습 시간 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">단원별 성취도</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="점수" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">단원별 학습 시간</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studyTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="chapter" type="category" />
                    <Tooltip />
                    <Bar dataKey="학습시간" fill="#06b6d4" radius={[0, 8, 8, 0]}>
                      {studyTimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 최근 시험 결과 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">최근 시험 결과</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-gray-600">날짜</th>
                      <th className="text-left py-3 px-4 text-gray-600">단원</th>
                      <th className="text-left py-3 px-4 text-gray-600">정답률</th>
                      <th className="text-left py-3 px-4 text-gray-600">정답 수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.slice().reverse().map((stat, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(stat.date).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                            {stat.chapter}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            (stat.score / stat.total) * 100 >= 80
                              ? "text-green-600"
                              : (stat.score / stat.total) * 100 >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}>
                            {Math.round((stat.score / stat.total) * 100)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          {stat.score} / {stat.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
