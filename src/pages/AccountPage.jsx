import { useEffect, useState } from "react";
import service from "../services/api";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const fetchUserData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        
        console.log('No token found. Redirect to login or handle accordingly.');
        return;
      }
      const response = await service.get("/auth/getProfile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      setUserData((prevUserData) => ({
        ...prevUserData,
        name: response.data.user.name,
        username: response.data.user.username,
        email: response.data.user.email,
        password: "",
        repeatPassword: "",
      }));
      console.log("Datos del usuario después de setUserData:", userData);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await service.patch("auth/profileEdit", userData);
      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-50">
      <div className="border form-div text-card-foreground shadow-sm bg-dark p-3 rounded">
        <Form className="my-4 mt-2 p-3">
          <div className="mb-3">
            <label htmlFor="name" className="text-white">
              Name
            </label>
            <Form.Control
              type="text"
              className={`pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white ${
                isEditing ? "" : "disabled"
              }`}
              id="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label htmlFor="username" className="text-white">
              Username
            </label>
            <Form.Control
              type="text"
              className={`pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white ${
                isEditing ? "" : "disabled"
              }`}
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label htmlFor="email" className="text-white">
              Email
            </label>
            <Form.Control
              type="text"
              className={`pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white ${
                isEditing ? "" : "disabled"
              }`}
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <label htmlFor="password" className="text-white">
              Password
            </label>
            <Form.Control
              type="password"
              className={`pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white ${
                isEditing ? "" : "disabled"
              }`}
              name="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              disabled={!isEditing}
            />
            {isEditing && (
              <div>
                <label htmlFor="repeatPassword" className="text-white">
                  Repeat Password
                </label>
                <Form.Control
                  type="password"
                  className={`pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white ${
                    isEditing ? "" : "disabled"
                  }`}
                  name="repeatPassword"
                  id="repeatPassword"
                  value={userData.repeatPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                />{" "}
              </div>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="d-flex justify-content-between">
            <Button
              type="button"
              className="bg-dark border border-primary"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  handleEdit();
                }
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button
              type="button"
              className="bg-dark border border-danger"
              onClick={handleLogOut}
            >
              Log Out
            </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AccountPage;
