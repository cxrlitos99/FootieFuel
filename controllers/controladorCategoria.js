import slugify from "slugify";
import categoriaModelo from "../models/categoriaModelo.js";

export const crearCategoriaControlador = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(401).send({ message: "El nombre es obligatorio" });
    }
    const existeCategoria = await categoriaModelo.findOne({ nombre });
    if (existeCategoria) {
      return res.status(200).send({
        success: true,
        message: "Esta categoria ya existe",
      });
    }
    const categoria = await new categoriaModelo({
      nombre,
      slug: slugify(nombre),
    }).save();
    res.status(201).send({
      success: true,
      message: "Nueva Categoria Creada",
      categoria,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error en la categoria",
    });
  }
};

//actualizar categoria
export const actualizarCategoriaControlador = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;
    const categoria = await categoriaModelo.findByIdAndUpdate(
      id,
      { nombre, slug: slugify(nombre) },
      { nuevo: true }
    );
    res.status(200).send({
      success: true,
      message: "Categoria actualizada correctamente",
      categoria,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar la categoria",
    });
  }
};

//obtener todas las categorias
export const controladorCategoria = async (req, res) => {
  try {
    const categoria = await categoriaModelo.find({});
    res.status(200).send({
      success: true,
      message: "Lista de todas las categorias",
      categoria,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener las categorias",
    });
  }
};

//categoria individual
export const individualCategoriaControlador = async (req, res) => {
  try {
    const categoria = await categoriaModelo.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Se ha mostrado correctamente una sola categoria",
      categoria,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener solo una categoria",
    });
  }
};

//borrar categoria
export const borrarCategoriaControlador = async (req, res) => {
  try {
    const { id } = req.params;
    await categoriaModelo.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categoria borrada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al borrar la categoria",
      error,
    });
  }
};
