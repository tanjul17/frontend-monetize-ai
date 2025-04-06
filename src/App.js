import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TokenProvider } from "./contexts/TokenContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import DevProfile from "./pages/DevProfile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Marketplace from "./pages/Marketplace";
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import ModelEdit from "./pages/ModelEdit";
import UserModels from "./pages/UserModels";
import ApiTester from "./pages/ApiTester";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import ModelAnalytics from "./pages/ModelAnalytics";
import TokenHistory from "./pages/TokenHistory";
import BuyTokens from "./pages/BuyTokens";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TokenProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.6),rgba(255,255,255,1))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03]"></div>
              </div>
              <Navbar />
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/verify-email/:token"
                    element={<VerifyEmail />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected Routes for any authenticated user */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Token Management Routes */}
                  <Route
                    path="/token-history"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <TokenHistory />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/buy-tokens"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <BuyTokens />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Routes for specific roles */}
                  <Route
                    path="/user-profile"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/dev-profile"
                    element={
                      <ProtectedRoute allowedRoles={["developer"]}>
                        <DevProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Analytics Dashboard Routes */}
                  <Route
                    path="/developer-dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["developer"]}>
                        <DeveloperDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/model-analytics/:id"
                    element={
                      <ProtectedRoute allowedRoles={["developer"]}>
                        <ModelAnalytics />
                      </ProtectedRoute>
                    }
                  />

                  {/* Marketplace Routes */}
                  <Route
                    path="/marketplace"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <Marketplace />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/marketplace/:id"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <ModelDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Routes */}
                  <Route
                    path="/models/published"
                    element={
                      <ProtectedRoute allowedRoles={["user", "developer"]}>
                        <UserModels />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/usage-history"
                    element={
                      <ProtectedRoute allowedRoles={["user"]}>
                        {/* UsageHistory component would go here in a real implementation */}
                        <div>Usage History Page</div>
                      </ProtectedRoute>
                    }
                  />

                  {/* Developer Routes */}
                  <Route
                    path="/models"
                    element={
                      <ProtectedRoute allowedRoles={["developer"]}>
                        <Models />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/models/:id/edit"
                    element={
                      <ProtectedRoute allowedRoles={["developer"]}>
                        <ModelEdit />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/api-tester"
                    element={
                      <ProtectedRoute
                        allowedRoles={["user", "developer", "admin"]}
                      >
                        <ApiTester />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </ThemeProvider>
        </TokenProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
