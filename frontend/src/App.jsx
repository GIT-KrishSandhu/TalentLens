import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCandidate from "./pages/AddCandidate";
import JobMatch from "./pages/JobMatch";
import ShortlistedCandidates from "./pages/ShortlistedCandidates";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-candidate"
          element={
            <PrivateRoute>
              <Navbar />
              <AddCandidate />
            </PrivateRoute>
          }
        />
        <Route
          path="/match"
          element={
            <PrivateRoute>
              <Navbar />
              <JobMatch />
            </PrivateRoute>
          }
        />
        <Route
          path="/shortlisted"
          element={
            <PrivateRoute>
              <Navbar />
              <ShortlistedCandidates />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;