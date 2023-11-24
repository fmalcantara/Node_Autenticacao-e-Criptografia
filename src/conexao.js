const {Pool} = require('pg');

const conexao = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'catalogo_pokemons'
})

module.exports = conexao