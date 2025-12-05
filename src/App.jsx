// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import SemesterPage from "./pages/SemesterPage.jsx";
import SubjectPage from "./pages/SubjectPage.jsx";
import PDFPage from "./pages/PDFPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdvancedSearchPage from "./pages/AdvancedSearchPage.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";

function App() {
  return (
    <Routes>
      {/* Student auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      {/* Student area (protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category/:categoryId"
        element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category/:categoryId/semester/:semesterId"
        element={
          <ProtectedRoute>
            <SemesterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/category/:categoryId/semester/:semesterId/subject/:subjectId"
        element={
          <ProtectedRoute>
            <SubjectPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pdf/:materialId"
        element={
          <ProtectedRoute>
            <PDFPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AdvancedSearchPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
