import service from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";

function LoginPage() {
  const { verifyToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await service.post("auth/login", formData);
      console.log("Received Token:", response.data.token);
      
      
      localStorage.setItem("authToken", response.data.token);

      

      await verifyToken();

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.errorMessage);
        navigate("/error");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Log in</button>
        </form>
  </div>
);

}

export default LoginPage;