import app from "./app.js";
import { connectDb } from "./config/db.js";

await connectDb();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Server is running on ${port}`));

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
