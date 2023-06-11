import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  actualizarPerfilControlador,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//crear objeto para router
const router = express.Router();

//routing
//registro de usuario por POST
router.post("/register", registerController);

//LOGIN POR POST
router.post("/login", loginController);

//Codigo para recuperar contraseña
router.post("/forgot-password", forgotPasswordController);

//testeo de las rutas
router.get("/test", requireSignIn, isAdmin, testController);

// rutas protegidas de atenticacion para el usuario
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// rutas protegidas de atenticacion para el administrador
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//actualizar perfil de usuario
router.put("/perfil", requireSignIn, actualizarPerfilControlador);

export default router;
