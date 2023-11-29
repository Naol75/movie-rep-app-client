import { useState } from "react";
import service from "../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await service.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      if(error.response && error.response.status === 400) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.errorMessage);
      }
      else {
        navigate('/error')
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange}/>
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange}/>
        <label htmlFor="repeatPassword">Repeat password</label>
        <input type="password" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange}/>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default RegisterPage