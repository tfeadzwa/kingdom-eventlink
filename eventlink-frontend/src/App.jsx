import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";
import HeaderNav from "./components/HeaderNav";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import TicketConfig from "./pages/TicketConfig";
import CreateCategory from "./pages/CreateCategory";
import React, { Suspense, lazy } from "react";
import "../fontIcons";
import NotFound from "./pages/NotFound.jsx";
import EventRegistration from "./pages/EventRegistration";
import PayEventRegistration from "./pages/PayEventRegistration";

const BrowseEvents = lazy(() => import("./pages/BrowseEvents"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const BrowseVenues = React.lazy(() => import("./pages/BrowseVenues"));
const CreateVenue = React.lazy(() => import("./pages/CreateVenue"));
const VenueDetails = React.lazy(() => import("./pages/VenueDetails"));

const PayEventRegistrationWrapper = () => {
  const { eventId } = useParams();
  // You should fetch registrationId and amount for the eventId here
  // For demo, use dummy values:
  const registrationId = eventId; // Replace with actual registrationId logic
  const amount = 10.0; // Replace with actual amount logic
  return (
    <PayEventRegistration registrationId={registrationId} amount={amount} />
  );
};

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  // Wait for auth state to load before rendering routes
  if (loading) return null;
  return (
    <>
      <HeaderNav />
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/event/:eventId/tickets"
            element={
              <AdminRoute>
                <TicketConfig />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create-category"
            element={
              <AdminRoute>
                <CreateCategory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create-ticket"
            element={
              <AdminRoute>
                <TicketConfig />
              </AdminRoute>
            }
          />
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route
            path="/event/:eventId/pay"
            element={<PayEventRegistrationWrapper />}
          />
          <Route path="/browse-venues" element={<BrowseVenues />} />
          <Route path="/venue/:venueId" element={<VenueDetails />} />
          <Route
            path="/admin/create-venue"
            element={
              <AdminRoute>
                <CreateVenue />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
