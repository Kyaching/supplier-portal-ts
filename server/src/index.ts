import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/users.route";
import departmentRoutes from "./routes/departments.route";
import employeeRoutes from "./routes/employees.route";
import job_titleRoutes from "./routes/simple.route";
import messagesRoutes from "./routes/message.route";
import login from "./routes/auth.route";
import cookieParser from "cookie-parser";
import {createServer} from "http";
import socketOperation from "./routes/socket/socket";

dotenv.config();
const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
const io = socketOperation(httpServer);

app.use(cors({origin: ["http://localhost:5173"], credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", userRoutes);
app.use("/api", departmentRoutes);
app.use("/api", employeeRoutes);
app.use("/api", job_titleRoutes);
app.use("/api", login);
app.use("/api", messagesRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
