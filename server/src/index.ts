import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/users.route";
import departmentRoutes from "./routes/departments.route";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", userRoutes);
app.use("/api", departmentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
