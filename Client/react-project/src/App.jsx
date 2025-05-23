import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/"
                element={
                  <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
                        Welcome to Evently
                      </h1>
                      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your premier platform for discovering and managing events. Create, explore, and experience unforgettable moments.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <a
                          href="/events"
                          className="px-6 py-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
                        >
                          Explore Events
                        </a>
                        <a
                          href="/register"
                          className="px-6 py-3 text-sm font-medium rounded-lg text-indigo-400 bg-white/10 hover:bg-white/20 transition-all duration-200"
                        >
                          Get Started
                        </a>
                      </div>
                    </div>
                  </div>
                }
              />
              {/* Add more routes here */}
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="dark"
          toastClassName="bg-gray-800 text-white"
          progressClassName="bg-indigo-500"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
