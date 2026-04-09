import { createBrowserRouter } from "react-router";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { UploadPage } from "./pages/UploadPage";
import { GeneratePage } from "./pages/GeneratePage";
import { SolvePage } from "./pages/SolvePage";
import { ResultPage } from "./pages/ResultPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: MainPage },
      { path: "upload", Component: UploadPage },
      { path: "generate", Component: GeneratePage },
      { path: "solve", Component: SolvePage },
      { path: "result", Component: ResultPage },
      { path: "statistics", Component: StatisticsPage },
    ],
  },
]);
