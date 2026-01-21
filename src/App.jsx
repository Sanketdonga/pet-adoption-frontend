import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './redux/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PetDetails from './pages/PetDetails';
import MyApplications from './pages/MyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Placeholder Pages for later
const NotFound = () => <h1>404 Not Found</h1>;

function App() {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);
  const [isAuthChecked, setIsAuthChecked] = React.useState(false);

  useEffect(() => {
    // Only fetch if we haven't checked yet (prevent double fetch in strict mode, though safe)
    const checkAuth = async () => {
        await dispatch(getMe());
        setIsAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  // Show loader only during the initial auth check
  // We can assume if !isAuthChecked, we are initializing.
  if (!isAuthChecked) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <CircularProgress />
          </Box>
      );
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
