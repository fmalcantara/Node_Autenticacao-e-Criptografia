const express = require('express')
const { cadastroUsuario, login } = require('./Controlador/usuarios')
const verificarLogin = require('./intermediario/verificaLogin')
const { cadastroPokemons, atualizarApelidoPokemon, listarPokemons, detalharPokemons, excluirPokemons } = require('./Controlador/pokemons')

const rota = express()

rota.post('/cadastrar', cadastroUsuario)
rota.post('/login', login)

rota.use(verificarLogin)

rota.post('/pokemon', cadastroPokemons),
rota.patch('/pokemon/:id', atualizarApelidoPokemon)
rota.get('/pokemon', listarPokemons)
rota.get('/pokemon/:id', detalharPokemons)
rota.delete('/pokemon/:id', excluirPokemons)

module.exports = rota