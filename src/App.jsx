import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmailProvider } from './context/EmailContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MailPage from './pages/MailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/mail/:folder?"
            element={
              <ProtectedRoute>
                <EmailProvider>
                  <MailPage />
                </EmailProvider>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/mail/inbox" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
