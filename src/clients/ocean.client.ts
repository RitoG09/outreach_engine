import axios from "axios";
import { env } from "../config/env.js";

export const oceanClient = axios.create({
  baseURL: "https://api.ocean.io",
  headers: {
    "X-Api-Token": env.oceanApiKey,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});
