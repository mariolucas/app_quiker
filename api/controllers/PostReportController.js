const Post = require("../models/Post");

class PostReportController {
    async getReport(req, res) {
        try {
            const [report] = await Post.getPostReport(); 
            res.json({ success: true, report });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Erro ao gerar relatório." });
        }
    }
}

module.exports = new PostReportController();