import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  actualizarProductoControlador,
  brainTreePagosControlador,
  braintreeTokenControlador,
  buscarProductoControlador,
  crearProductoControlador,
  deleteProductoControlador,
  getProductoControlador,
  productoF1Controlador,
  productoFiltroControlador,
  productoFotoControlador,
  productoFutbolControlador,
  relacionadoProductoControlador,
} from "../controllers/controladorProducto.js";
import formidable from "express-formidable";
import { getIndividualProductoControlador } from "./../controllers/controladorProducto.js";
import braintree from "braintree";
const router = express.Router();

//rutas
//crear categoria
router.post(
  "/crear-producto",
  requireSignIn,
  isAdmin,
  formidable(),
  crearProductoControlador
);

//rutas
//crear categoria
router.put(
  "/actualizar-producto/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  actualizarProductoControlador
);

//obtener productos
router.get("/get-producto", getProductoControlador);

//producto individual
router.get("/get-producto/:slug", getIndividualProductoControlador);

//obtener la imagen
router.get("/producto-foto/:pid", productoFotoControlador);

//borrar producto
router.delete("/delete-producto/:pid", deleteProductoControlador);

//filtrar producto
router.post("/producto-filtros", productoFiltroControlador);

//buscar producto
router.get("/buscar/:keyword", buscarProductoControlador);

//productos similares
router.get("/producto-relacionado/:pid/:cid", relacionadoProductoControlador);

//productos f1
router.get("/producto-f1/:slug", productoF1Controlador);

//productos futbol
router.get("/producto-fut/:slug", productoFutbolControlador);

//rutas pagos
router.get("/braintree/token", braintreeTokenControlador);

//pagos
router.post("/braintree/payment", requireSignIn, brainTreePagosControlador);

export default router;
