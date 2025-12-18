import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { QRScanner } from './components/scanner/QRScanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/checkin/:token" element={<QRScanner />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;