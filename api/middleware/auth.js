const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ success: false, message: "Acesso negado. Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Armazena os dados do usuário
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: "Token inválido." });
    }
};
