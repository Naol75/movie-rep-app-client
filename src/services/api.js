import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authToken = localStorage.getItem("authToken");
if (authToken) {
  service.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
}

export default service;
