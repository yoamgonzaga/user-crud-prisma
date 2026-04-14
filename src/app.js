require("dotenv").config();
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

app.use(express.json()); // importante para JSON

app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
