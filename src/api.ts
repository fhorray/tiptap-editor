import axios from "axios";

// Cria a instância do Axios
const api = axios.create({
  baseURL: `http://127.0.0.1:8787/v1`,
  timeout: 55000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar os headers dinâmicos antes de cada requisição
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const response = await fetch("/api/signature");
//       const hash = await response.json() as { timestamp: string, hash: string };

//       config.headers["x-timestamp"] = hash.timestamp;
//       config.headers["x-signature"] = hash.hash;
//     } catch (error) {
//       console.error("⚠️ Erro ao gerar assinatura:", error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default api;


