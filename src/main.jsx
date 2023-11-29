
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from './context/auth.context.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </BrowserRouter>

)
