import dotenv from "dotenv";

dotenv.config();

export const env = {
  oceanApiKey: process.env.OCEAN_API_KEY!,
  prospeoApiKey: process.env.PROSPEO_API_KEY!,
  hunterApiKey: process.env.HUNTER_API_KEY!,
  brevoApiKey: process.env.BREVO_API_KEY!,
};
