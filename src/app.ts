import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;
//cors
app.use(cors());
app.use(express.json());
//here we use the use all the routes in our appication
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
