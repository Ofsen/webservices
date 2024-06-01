import axios from "axios";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_JWT_SECRET;
axios.defaults.withCredentials = true;
