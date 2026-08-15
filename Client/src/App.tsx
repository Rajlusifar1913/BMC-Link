import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PublicProfilePage } from '@/pages/PublicProfilePage'
import { ToastProvider } from '@/context/ToastContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/:username" element={<PublicProfilePage />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  )
}
