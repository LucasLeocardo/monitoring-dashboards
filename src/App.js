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
          position='bottom-center'
          autoClose={3000}
        />
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
