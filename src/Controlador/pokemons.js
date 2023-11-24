const conexao = require("../conexao");

const cadastroPokemons = async (req, res) => {
  const {nome, habilidades, imagem, apelido} = req.body

  try {
    if(!nome){
      return res.status(404).json({message: "O Nome é obrigatorio"})
    }
  
    if(!habilidades){
      return res.status(404).json({message: "Habilidade é obrigatória"})
    }
  
    if(!imagem){
      return res.status(404).json({message: "imagem obrigatoria"})
    }
  
    if(!apelido){
      return res.status(404).json({message: "apelido obrigatorio"})
    }
  
    const cadastrar = await conexao.query('insert into pokemons (nome, habilidades, imagem, apelido, usuario_id) values ($1, $2, $3, $4, $5) returning *', [nome, habilidades, imagem, apelido, req.usuario.id ]) 
  
    

    res.status(201).json({message: "Usuario cadastrado com sucesso"})

  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
  }
}

const atualizarApelidoPokemon = async(req, res)=>{
  const {id} = req.params
  const {apelido} = req.body

  try {
    const pokemon = await conexao.query('select * from pokemons where id = $1 and usuario_id = $2', [id, req.usuario.id])
    if(!pokemon.rowCount === 0) {
      return res.status(404).json({message: "Pokemon não encontrado"})
    }

    await conexao.query('update pokemons set apelido = $1 where id = $2', [apelido, id])
    res.status(200).json({message: "Pokeon atualizado com sucesso"})

  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
  }

}

const listarPokemons = async (req, res) => {
  try {
    const {rows : pokemons} = await conexao.query('select id, nome, habilidades, imagem, apelido from pokemons where usuario_id = $1', [req.usuario.id])
    if(pokemons === 0){
      return res.status(404).json({message: "Resultado não encontrado"})
    } 

    for (const pokemon of pokemons){
      pokemon.habilidades = pokemon.habilidades.split(', ')
      pokemon.usuario = req.usuario.nome
    }

    res.status(200).json(pokemons)
  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
    
  }
  
  
 }

 const detalharPokemons = async (req, res) => {
    const {id} = req.params
  try {
    const {rows, rowCount} = await conexao.query('select id, nome, habilidades, apelido, imagem from pokemons where id = $1 and usuario_id = $2', [id, req.usuario.id])
    
    if(rowCount === 0){
      return res.status(404).json({message: "Resultado não encontrado"})
    } 

    const pokemon = rows[0]
      pokemon.habilidades = pokemon.habilidades.split(', ')
      pokemon.usuario = req.usuario.nome
    

    res.status(200).json(pokemon)
  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
    
  }
  

 }
 
 
 const excluirPokemons = async (req, res) => {
  const {id} = req.params
  try {
    const {rows, rowCount} = await conexao.query('select id, nome, habilidades, apelido, imagem from pokemons where id = $1 and usuario_id = $2', [id, req.usuario.id])
    
    if(rowCount === 0){
      return res.status(404).json({message: "Resultado não encontrado"})
    } 
    
    await conexao.query('delete from pokemons where id = $1', [id])

    res.status(200).json("Pokemon deletado com sucesso")
  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
    
  }
  

 }


module.exports = {
  cadastroPokemons, 
  atualizarApelidoPokemon,
  listarPokemons,
  detalharPokemons,
  excluirPokemons
}