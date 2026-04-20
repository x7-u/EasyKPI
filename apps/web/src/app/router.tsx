import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { KPIDetailPage } from "../features/catalog/KPIDetailPage";
import { ComparePage } from "../features/compare/ComparePage";
import { CalculatorPage } from "../features/calculator/CalculatorPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { UploadPage } from "../features/upload/UploadPage";
import { SettingsPage } from "../features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/catalog" replace /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "kpis/:id", element: <KPIDetailPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "calculator", element: <CalculatorPage /> },
      { path: "calculator/:id", element: <CalculatorPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
