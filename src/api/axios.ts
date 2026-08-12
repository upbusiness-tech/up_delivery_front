import axios from "axios";
import { auth } from "./firebase";

export const api = axios.create({
  baseURL: "http://localhost:3000",
})

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if(token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config;
// })

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    // getIdToken() SEM forceRefresh: o SDK só busca um novo token
    // da rede se o atual estiver perto de expirar (~5 min de margem).
    // Caso contrário, devolve o token em cache, sem custo de rede.
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;