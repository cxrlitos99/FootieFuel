import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`Conectado a MongoDB ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`Error en MongoDB ${error}`.bgRed.white);
  }
};

export default connectDB;
