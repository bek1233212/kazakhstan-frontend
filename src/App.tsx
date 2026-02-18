import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Destinations from './pages/Destinations';
import About from './pages/About';
import CompanyDetail from './pages/CompanyDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useRouter } from './hooks/useRouter';

function App() {
  const { currentPath, matchRoute } = useRouter();
  const companyMatch = matchRoute('/company/:id');

  const renderPage = () => {
    if (companyMatch.isMatch) {
      return <CompanyDetail />;
    }

    switch (currentPath) {
      case '/':
        return <Home />;
      case '/tours':
        return <Tours />;
      case '/destinations':
        return <Destinations />;
      case '/about':
        return <About />;
      case '/login':
        return <Login />;
      case '/dashboard':
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850">
      <Navigation />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
