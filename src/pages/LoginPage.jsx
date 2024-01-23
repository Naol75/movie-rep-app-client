import service from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { Form, Button } from "react-bootstrap";

export default function LoginPage() {
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
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-50">
      <div className="border form-div text-card-foreground shadow-sm bg-dark p-3 rounded">
        <Form onSubmit={handleSubmit} className="my-4 mt-2 p-3">
          <div className="mb-3">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <Form.Control
              type="text"
              required
              className="pl-3 mb-3 mt-2 pr-2 py-2 username-icon bg-dark rounded text-white"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{ textIndent: 24 }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <Form.Control
              type="password"
              required
              className="pl-3 pr-2 mb-4 mt-2 py-2 password-icon bg-dark rounded text-white"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ textIndent: 27 }}
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button
            variant="primary"
            type="submit"
            className="w-100 bg-dark text-white mt-3 mb-1"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
