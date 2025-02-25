const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

class AuthController {
  async register(req, res){
    const { name, email, password } = req.body;
 
    try {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.json({ success: false, message: "Email já cadastrado." });
      }
  
      await User.create({ name, email, password });
  
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Erro ao registrar usuário." });
    }
  };
  
  async login(req, res){
    const { email, password } = req.body;
  
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.json({ success: false, message: "Usuário não encontrado." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Senha incorreta." });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
  
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Erro ao fazer login." });
    }
  };  
}

module.exports = new AuthController();