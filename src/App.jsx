import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Library from "./pages/Library";
import KitHome from "./pages/KitHome";
import BookletView from "./pages/BookletView";
import FlashcardGuide from "./pages/FlashcardGuide";
import QuarterView from "./pages/QuarterView";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kit/:kitId"
            element={
              <ProtectedRoute>
                <KitHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kit/:kitId/flashcards"
            element={
              <ProtectedRoute>
                <FlashcardGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kit/:kitId/quarter/:quarterId"
            element={
              <ProtectedRoute>
                <QuarterView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kit/:kitId/booklet/:bookletId"
            element={
              <ProtectedRoute>
                <BookletView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "staff"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
