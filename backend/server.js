import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = Array.from(
  new Set([
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
  ]),
);

export const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" &&
          origin.startsWith("http://localhost"))
      ) {
        return callback(null, true);
      }
      return callback(
        new Error(`Socket CORS policy: ${origin} not allowed`),
        false,
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== "production" &&
        origin.startsWith("http://localhost"))
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: ${origin} not allowed`), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to every request
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/careers", careerRoutes);
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", message: "Victory Bazars API running 🛒" }),
);

// Socket.io
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on("join_admin", () => {
    socket.join("admin_room");
    console.log(`👑 Admin joined: ${socket.id}`);
  });
  socket.on("disconnect", () => console.log(`❌ Disconnected: ${socket.id}`));
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`),
);
