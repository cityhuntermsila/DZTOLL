import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SearchPage from './pages/SearchPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionCheckoutPage from './pages/SubscriptionCheckoutPage';
import PlateTestPage from './pages/PlateTestPage';
import OwnerDashboard from './pages/OwnerDashboard';
import ListingForm from './pages/ListingForm';
import ChatPage from './pages/ChatPage';
import BookingHistory from './pages/BookingHistory';
import ProfilePage from './pages/ProfilePage';
import './i18n';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/subscriptions/checkout" element={<SubscriptionCheckoutPage />} />
          <Route path="/plate-test" element={<PlateTestPage />} />

          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/new" element={<ListingForm />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
