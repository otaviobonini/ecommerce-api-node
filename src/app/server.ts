import { env } from "../schemas/env.schema.js";
import app from "./app.js";
import "dotenv/config";

const PORT = env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
