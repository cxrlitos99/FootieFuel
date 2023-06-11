import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion, answer } = req.body;
    // realizamos las validaciones
    if (!nombre) {
      return res.send({ message: "El nombre es obligatorio" });
    }
    if (!email) {
      return res.send({ message: "El email es obligatorio" });
    }
    if (!password) {
      return res.send({ message: "La constraseña es obligatoria" });
    }
    if (!telefono) {
      return res.send({ message: "El teléfono es obligatorio" });
    }
    if (!direccion) {
      return res.send({ message: "La dirección es obligatoria" });
    }
    if (!answer) {
      return res.send({ message: "La respuesta es obligatoria" });
    }

    // comprobación usuarios que ya existen

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Este usuario ya está registrado",
      });
    }

    //Para registrar un usuario nuevo
    const hashedPassword = await hashPassword(password);
    //para guardar el usuario
    const user = await new userModel({
      nombre,
      email,
      telefono,
      direccion,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "El usuario ha sido registrado con éxito",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error en el Registro",
      error,
    });
  }
};

// Realizar login por POST
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validar datos
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Contraseña o email incorrecto",
      });
    }
    //comprobar el usuario
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Este email no está registrado",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Contraseña incorrecta",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Inicio de sesión correctamente",
      user: {
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
        rol: user.rol,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al iniciar sesión",
      error,
    });
  }
};

//Recuperación de pwd
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email obligatorio" });
    }
    if (!answer) {
      res.status(400).send({ message: "repsuesta obligatorio" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "contraseña nueva obligatorio" });
    }
    //ccheck
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email mal o la respuesta",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Contraseña cambiada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Algo ha salido mal",
      error,
    });
  }
};

//testeo controladores
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//actualizar perfil de usuario
export const actualizarPerfilControlador = async (req, res) => {
  try {
    const { nombre, password, direccion, telefono } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "La contraseña es obligatoria y debe tener mínimo 6 carácteres",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const actualizarUsuario = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        nombre: nombre || user.nombre,
        password: hashedPassword || user.password,
        telefono: telefono || user.telefono,
        direccion: direccion || user.direccion,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Perfil actualizado correctamente",
      actualizarUsuario,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al actualizar el perfil",
      error,
    });
  }
};
