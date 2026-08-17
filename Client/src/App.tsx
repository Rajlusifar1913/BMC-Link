import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy-loaded routes for instant initial boot & smooth route-level chunking
const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const PurchasesPage = lazy(() => import("@/pages/PurchasesPage").then((m) => ({ default: m.PurchasesPage })));
const MembershipsPage = lazy(() => import("@/pages/MembershipsPage").then((m) => ({ default: m.MembershipsPage })));
const AdminPage = lazy(() => import("@/pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })));
const PublicProfilePage = lazy(() => import("@/pages/PublicProfilePage").then((m) => ({ default: m.PublicProfilePage })));

function PageLoader() {
  return (
    <div className="min-h-screen bg-nu-bg flex flex-col items-center justify-center p-6 transition-opacity duration-200">
      <div className="w-12 h-12 rounded-2xl bg-nu-purple/10 dark:bg-nu-purple/20 flex items-center justify-center animate-pulse">
        <div className="w-6 h-6 rounded-full border-2 border-nu-purple border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/purchases" element={<PurchasesPage />} />
              <Route path="/dashboard/memberships" element={<MembershipsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/:username/products/:slug" element={<ProductDetailPage />} />
              <Route path="/:username" element={<PublicProfilePage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
