import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/bd.js";
import authRoutes from "./routes/authRoute.js";
import categoriaRutas from "./routes/categoriaRutas.js";
import productoRutas from "./routes/productoRutas.js";
import cors from "cors";
import path from "path";
//Configuramos dotenv
dotenv.config();

//database config
connectDB();

// objeto rest
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

//rutas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categoria", categoriaRutas);
app.use("/api/v1/producto", productoRutas);

// api rest
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// definimos el puerto
const PUERTO = process.env.PUERTO || 8080;

// puerto por el que escucha el servidor
app.listen(PUERTO, () => {
  console.log(
    `Servidor corriendo en modo ${process.env.MODO} en el puerto ${PUERTO}`
      .bgCyan.white
  );
});
