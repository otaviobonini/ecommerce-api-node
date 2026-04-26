import "dotenv/config";
import { env } from "../schemas/env.schema.js";
import app from "./app.js";

const PORT = env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
