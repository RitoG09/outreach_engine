import axios from "axios";
import { env } from "../config/env.js";

export const prospeoClient = axios.create({
  baseURL: "https://api.prospeo.io",

  headers: {
    "X-KEY": env.prospeoApiKey,
    "Content-Type": "application/json",
  },

  timeout: 30000,
});
