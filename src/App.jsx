import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './contexts/ContentContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Sidebar from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/Home';
import ClassPage from './pages/Class';
import CasePage from './pages/Case';
import TestPage from './pages/Test';

function App() {
  return (
    <Router>
      <ContentProvider>
        <NavigationProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 lg:grid lg:grid-cols-[280px_1fr]">
              <Sidebar />
              <main className="w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/class/*" element={<ClassPage />} />
                  <Route path="/case/*" element={<CasePage />} />
                  <Route path="/test/*" element={<TestPage />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </NavigationProvider>
      </ContentProvider>
    </Router>
  );
}

export default App;
