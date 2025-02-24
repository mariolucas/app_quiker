const User = require("../models/User");

class ProfileController {
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Erro ao carregar perfil." });
        }
    }

    async updateProfile(req, res) {
        const { name, email, password } = req.body;

        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }

            await User.update(req.user.id, { name, email, password });

            res.json({ success: true, message: "Perfil atualizado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Erro ao atualizar perfil." });
        }
    }
}

module.exports = new ProfileController();
