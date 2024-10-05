const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { swaggerUi, swaggerDocs } = require('./src/config/swagger/swagger'); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
