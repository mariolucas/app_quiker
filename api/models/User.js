const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const bcrypt = require("bcryptjs");

class User {
    async findByEmail(email) {
        return knex("users").where({ email }).first();
    }

    async findById(id) {
        return knex("users").where({ id }).first();
    }

    async create({ name, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return knex("users").insert({ name, email, password: hashedPassword });
    }

    async update(id, { name, email, password }) {
        const updateData = { name, email };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        return knex("users").where({ id }).update(updateData);
    }
}

module.exports = new User();
