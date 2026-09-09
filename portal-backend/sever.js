require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORTA = process.env.PORTA || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
 res.json({
 mensagem: "Backend do Portal DSM funcionando!"
 });
});
app.listen(PORTA, () => {
 console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
