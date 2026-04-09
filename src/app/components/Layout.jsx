import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { BookOpen, BarChart3, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === "/";
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
    } else {
      const user = JSON.parse(currentUser);
      setUserName(user.name);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isMainPage && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">큐브릿지</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  to="/statistics"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>학습 통계</span>
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-semibold">{userName}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}