import axios from "axios";
import { env } from "../config/env.js";

export const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": env.brevoApiKey,
    accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 3000,
});
