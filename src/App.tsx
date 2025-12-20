import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { QRScanner } from './components/scanner/QRScanner';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GuestPass } from './components/pass/GuestPass';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<RegistrationForm />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/scan" element={<QRScanner />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/pass/:token" element={<GuestPass />} />
              <Route path="/checkin/:token" element={<QRScanner />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" closeOnClick newestOnTop pauseOnHover={false} theme="light" />
      </>
    </BrowserRouter>
  );
}

export default App;