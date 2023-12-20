import { createContext, useEffect, useState } from 'react';
import service from '../services/api';
import { MoonLoader } from 'react-spinners';

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isUserActive, setIsUserActive] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const verifyToken = async () => {
    setIsPageLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
  
      console.log('Stored Token:', authToken);

      if (!authToken) {
        console.log('Token is not defined. Aborting verification.');
        setIsUserActive(false);
        setIsPageLoading(false);
        setActiveUserId(null);
        return;
      }
  
      const response = await service.get('auth/verify', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      setIsUserActive(true);
      setActiveUserId(response.data._id);
      setIsPageLoading(false);
    } catch (error) {
      console.error('Token Verification Error:', error);
  
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized - Other Issue');
      }
  
      setIsUserActive(false);
      setIsPageLoading(false);
      setActiveUserId(null);
    }
  };

  useEffect(() => {
    console.log("AuthWrapper: Before verifyToken")
     verifyToken();
  }, []);

  const passedContext = {
    verifyToken,
    isUserActive,
    activeUserId,
  };

  if (isPageLoading) {
    return <MoonLoader style={{ color: 'rgba(199, 189, 52, 0.99)' }} />;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };