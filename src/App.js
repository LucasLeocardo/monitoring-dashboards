import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer 
          autoClose={2000}
        />
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
