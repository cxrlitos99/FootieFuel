import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  actualizarCategoriaControlador,
  borrarCategoriaControlador,
  controladorCategoria,
  crearCategoriaControlador,
  individualCategoriaControlador,
} from "../controllers/controladorCategoria.js";

const router = express.Router();

//rutas
//crear categoria
router.post(
  "/crear-categoria",
  requireSignIn,
  isAdmin,
  crearCategoriaControlador
);
//actualizar categoria
router.put(
  "/actualizar-categoria/:id",
  requireSignIn,
  isAdmin,
  actualizarCategoriaControlador
);

//obtener todas las categorias
router.get("/get-categoria", controladorCategoria);

//categoria individual
router.get("/individual-categoria/:slug", individualCategoriaControlador);

//borrar categoria
router.delete(
  "/borrar-categoria/:id",
  requireSignIn,
  isAdmin,
  borrarCategoriaControlador
);

export default router;
