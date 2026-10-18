import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ThemeProvider } from './theme/ThemeProvider'
import { AuthProvider } from './auth/AuthProvider'
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SavedPage = lazy(() => import('./pages/SavedPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminModeration = lazy(() => import('./admin/AdminModeration'))
const AdminMembers = lazy(() => import('./admin/AdminMembers'))
const AdminContent = lazy(() => import('./admin/AdminContent'))

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="learn" element={<LearnPage />} />
              <Route path="learn/:trackSlug" element={<TrackPage />} />
              <Route path="learn/:trackSlug/:lessonSlug" element={<LessonPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="u/:username" element={<ProfilePage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="signin" element={<SignInPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />

              <Route
                path="admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="moderation" element={<AdminModeration />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="content" element={<AdminContent />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}