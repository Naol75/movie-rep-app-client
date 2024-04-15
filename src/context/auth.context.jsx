import { createContext, useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import PropTypes from 'prop-types';

const AuthContext = createContext();

function AuthWrapper(props) {
  const [ip, setIp] = useState("");
  const [userRegion, setUserRegion] = useState("");
  const [isUserActive, setIsUserActive] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchUserLocation = async () => {
    try {
      const response = await axios.get("https://ip-api.io/json/");
      const data = response.data;
      setUserRegion(data.country_code);
    } catch (error) {
      console.error("Error fetching user location by IP:", error);
    } finally {
      setIsPageLoading(false);
    }
  };
  const verifyToken = async () => {
    setIsPageLoading(true);
    try {
      const ipResponse = await service.get("auth/getIp");
      setIp(ipResponse.data.ip);

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setIsUserActive(false);
        setIsPageLoading(false);
        setActiveUserId(null);
        return;
      }

      const response = await service.get("auth/verify", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setIsUserActive(true);
      setActiveUserId(response.data.userId);
      setIsPageLoading(false);
    } catch (error) {
      console.error("Token Verification Error:", error);

      if (error.response && error.response.status === 401) {
        console.log("Unauthorized - Other Issue");
      }

      setIsUserActive(false);
      setIsPageLoading(false);
      setActiveUserId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      verifyToken();
    };
    fetchData();
    fetchUserLocation();
  }, []);

  const passedContext = {
    verifyToken,
    isUserActive,
    activeUserId,
    ip,
    userRegion,
  };

  if (isPageLoading) {
    return <MoonLoader style={{ color: "rgba(199, 189, 52, 0.99)" }} />;
  }

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

AuthWrapper.propTypes = {
  children: PropTypes.node,
};
export { AuthContext, AuthWrapper };
