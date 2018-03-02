const Knex = require('knex');
const config = require('../../knexfile.js')['test'];

module.exports = Knex(config);
