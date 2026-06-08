import axios from "axios";
import { env } from "../config/env.js";

export const hunterClient = axios.create({
  baseURL: "https://api.hunter.io/v2",
  params: {
    api_key: env.hunterApiKey,
  },
  timeout: 30000,
});
