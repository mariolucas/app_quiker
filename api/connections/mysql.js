const knexConfig = require('./../config/knexfile');
const knex = require('knex')(knexConfig);

module.exports = knex;