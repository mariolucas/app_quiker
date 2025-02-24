require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const port = 5000;

const routes = require('./routes/route');

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use('/api', routes);

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})