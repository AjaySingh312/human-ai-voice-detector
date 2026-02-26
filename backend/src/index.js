import dotenv from "dotenv";
import app from "./server.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  // Simple startup log
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
