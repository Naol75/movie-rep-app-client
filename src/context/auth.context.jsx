import { createContext, useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";

const AuthContext = createContext();

function AuthWrapper(props) {
  const [ip, setIp] = useState("");
  const [userRegion, setUserRegion] = useState("");
  const [isUserActive, setIsUserActive] = useState(false);
  const [activeUserId, setActiveUserId] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const apiUrl = `https://ip-api.com/json/`;

  const fetchUserLocation = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Response from IP API:", data);
      setUserRegion(data.countryCode);
      console.log(userRegion);
    } catch (error) {
      console.error("Error fetching user location by IP:", error);
    }
  };
  const verifyToken = async () => {
    setIsPageLoading(true);
    try {
      const ipResponse = await service.get("auth/getIp");
      setIp(ipResponse.data.ip);

      const authToken = localStorage.getItem("authToken");

      console.log("Stored Token:", authToken);

      if (!authToken) {
        console.log("Token is not defined. Aborting verification.");
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

      console.log("API Response:", response.data);
      console.log("User ID from response:", response.data.userId);

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
    console.log("AuthWrapper: Before verifyToken");
    const fetchData = async () => {
      await fetchUserLocation();
      verifyToken();
    };
    fetchData();
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

export { AuthContext, AuthWrapper };
