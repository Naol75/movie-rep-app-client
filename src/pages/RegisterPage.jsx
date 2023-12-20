import { useState, useEffect } from "react";
import service from "../services/api";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function RegisterPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    console.log("handleImageChange triggered");
    const file = e.target.files[0];
    console.log("Selected image file:", file);
  
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setImagePreview(reader.result);
  
      
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));
  
      console.log("Updated formData:", formData);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
  
      // Append all form data fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
  
      // Append the image file
      formDataToSend.append("image", formData.image);
  
      console.log("formDataToSend before sending:", formDataToSend);
  
      const response = await service.post("/auth/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };



  return (
    <div className="d-flex align-items-center justify-content-center vh-50">
      <div className="border form-div text-card-foreground shadow-sm bg-dark p-3 rounded">
        <Form onSubmit={handleSubmit} encType="multipart/form-data" className="my-4 mt-2 p-3">
          <div className="mb-3">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="img-preview mt-2"
              />
            )}
            <div className="">
              <label className="imglabel">Profile Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control form-control-sm"
                id="formFileSm"
              />
            </div>
            <label htmlFor="name" className="text-white">
              Name
            </label>
            <Form.Control
              type="text"
              required
              className="pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <Form.Control
              type="text"
              required
              className="pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="email" className="text-white">
              E-mail
            </label>
            <Form.Control
              type="email"
              required
              id="email"
              className="pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <Form.Control
              type="password"
              required
              id="password"
              className="pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="repeatPassword" className="text-white">
              Repeat password
            </label>
            <Form.Control
              type="password"
              required
              id="repeatPassword"
              className="pl-3 mb-3 mt-2 pr-2 py-2 bg-dark rounded text-white"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button
            variant="primary"
            type="submit"
            className="w-100 bg-dark text-white mt-3 mb-1"
          >
            Sign up
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
