import productoModelo from "../models/productoModelo.js";
import categoriaModelo from "../models/categoriaModelo.js";
import orderModelo from "../models/orderModelo.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const crearProductoControlador = async (req, res) => {
  try {
    const { nombre, slug, descripcion, precio, categoria, cantidad, envio } =
      req.fields;
    const { foto } = req.files;

    //validacion
    switch (true) {
      case !nombre:
        return res.status(500).send({ error: "El nombre es obligatorio" });
      case !descripcion:
        return res.status(500).send({ error: "La descripcion es obligatoria" });
      case !precio:
        return res.status(500).send({ error: "El precio es obligatorio" });
      case !categoria:
        return res.status(500).send({ error: "La categoria es obligatoria" });
      case !cantidad:
        return res.status(500).send({ error: "La cantidad es obligatoria" });
      case foto && foto.size > 1000000:
        return res
          .status(500)
          .send({ error: "La foto es obligatorio y debe ocupar menos de 1Mb" });
    }

    const producto = new productoModelo({
      ...req.fields,
      slug: slugify(nombre),
    });
    if (foto) {
      producto.foto.data = fs.readFileSync(foto.path);
      producto.foto.contentType = foto.type;
    }
    await producto.save();
    res.status(201).send({
      success: true,
      message: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear el producto",
    });
  }
};

//obtener todos los productos
export const getProductoControlador = async (req, res) => {
  try {
    const productos = await productoModelo
      .find({})
      .populate("categoria")
      .select("-foto")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      cuentaTotal: productos.length,
      message: "Todos los productos",
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

//obtener solo un producto
export const getIndividualProductoControlador = async (req, res) => {
  try {
    const producto = await productoModelo
      .findOne({ slug: req.params.slug })
      .select("-foto")
      .populate("categoria");
    res.status(200).send({
      success: true,
      message: "Producto individual encontrado",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener un solo producto",
      error,
    });
  }
};

//obtener la imagen
export const productoFotoControlador = async (req, res) => {
  try {
    const producto = await productoModelo
      .findById(req.params.pid)
      .select("foto");
    if (producto.foto.data) {
      res.set("Content-type", producto.foto.contentType);
      return res.status(200).send(producto.foto.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al obtener la foto",
      error,
    });
  }
};

//borrar controlador
export const deleteProductoControlador = async (req, res) => {
  try {
    await productoModelo.findByIdAndDelete(req.params.pid).select("-foto");
    res.status(200).send({
      success: true,
      message: "Producto borrado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al borrar el producto",
      error,
    });
  }
};

//actualizar producto
export const actualizarProductoControlador = async (req, res) => {
  try {
    const { nombre, slug, descripcion, precio, categoria, cantidad, envio } =
      req.fields;
    const { foto } = req.files;

    //validacion
    switch (true) {
      case !nombre:
        return res.status(500).send({ error: "El nombre es obligatorio" });
      case !descripcion:
        return res.status(500).send({ error: "La descripcion es obligatoria" });
      case !precio:
        return res.status(500).send({ error: "El precio es obligatorio" });
      case !categoria:
        return res.status(500).send({ error: "La categoria es obligatoria" });
      case !cantidad:
        return res.status(500).send({ error: "La cantidad es obligatoria" });
      case foto && foto.size > 1000000:
        return res
          .status(500)
          .send({ error: "La foto es obligatorio y debe ocupar menos de 1Mb" });
    }

    const producto = await productoModelo.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(nombre) },
      { new: true }
    );
    if (foto) {
      producto.foto.data = fs.readFileSync(foto.path);
      producto.foto.contentType = foto.type;
    }
    await producto.save();
    res.status(201).send({
      success: true,
      message: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar el producto",
    });
  }
};

//filtros

export const productoFiltroControlador = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let argumentos = {};
    if (checked.length > 0) argumentos.categoria = checked;
    if (radio.length) argumentos.precio = { $gte: radio[0], $lte: radio[1] };
    const productos = await productoModelo.find(argumentos);
    res.status(200).send({
      success: true,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al filtrar productos",
      error,
    });
  }
};

// buscar producto

export const buscarProductoControlador = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resultado = await productoModelo
      .find({
        $or: [
          { nombre: { $regex: keyword, $options: "i" } },
          { descripcion: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-foto");
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al buscar el producto",
      error,
    });
  }
};

//productos relacionados
export const relacionadoProductoControlador = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const productos = await productoModelo
      .find({
        categoria: cid,
        _id: { $ne: pid },
      })
      .select("-foto")
      .limit(3)
      .populate("categoria");
    res.status(200).send({
      success: true,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al obtener los productos relacionados",
      error,
    });
  }
};

//obtener productos de f1 por categorias
export const productoF1Controlador = async (req, res) => {
  try {
    const categoriaf1 = await categoriaModelo.findOne({
      slug: req.params.slug,
    });
    const productos = await productoModelo
      .find({ categoria: categoriaf1 })
      .populate("categoria");
    res.status(200).send({
      success: true,
      categoriaf1,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error al obtener los productos",
    });
  }
};

//obtener productos de futbol por categorias
export const productoFutbolControlador = async (req, res) => {
  try {
    const categoriafut = await categoriaModelo.findOne({
      slug: req.params.slug,
    });
    const productos = await productoModelo
      .find({ categoria: categoriafut })
      .populate("categoria");
    res.status(200).send({
      success: true,
      categoriafut,
      productos,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error al obtener los productos",
    });
  }
};

export const braintreeTokenControlador = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const brainTreePagosControlador = async (req, res) => {
  try {
    const { nonce, carro } = req.body;
    let total = 0;
    carro.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModelo({
            products: carro,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
