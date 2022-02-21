const { port } = require("./config/config");
const express = require("express");
const app = new express();

app.get("/", (req, res) => {
  res.send([]);
});

app.listen(port, () => console.log(`http://localhost:${port}`));
