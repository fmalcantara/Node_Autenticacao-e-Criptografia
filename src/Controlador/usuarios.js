const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaJwt.js");

const cadastroUsuario = async (req, res) =>{
  const {nome, email, senha} = req.body;
try {
  const emailExist = await conexao.query('select * from usuarios where email = $1', [email])
    if(emailExist.rowCount > 0){
      res.status(400).json({message:"Email já cadastrado"})
    }
  if(!nome){
    return res.status(404).json({message: "nome inválido"})
  }

  if(!email){
    return res.status(404).json({message: "email inválido"})
  }

  if(!senha){
    return res.status(404).json({message: "senha inválida"})
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10)

  await conexao.query('INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3)', [nome, email, senhaCriptografada])

  return res.status(201).json({message:"Usuario criado com sucesso"})

} catch (error) {
  res.status(500).json({message: error.message || "Erro interno do servidor"});
  }
}

const login = async (req, res)=>{
  const {email, senha} = req.body
  
  try {
    const usuario = await conexao.query('select * from usuarios where email = $1', [email])
   
    if(usuario.rowCount === 0){
      return res.status(404).json({message: "Email inválido"})
    } 

    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)
    if(!senhaValida){
      return res.status(404).json({message: "Senha inválida"})
    }

    const token = jwt.sign({id: usuario.rows[0].id}, senhaJwt, {expiresIn: '8h'})

    const {senha: _ , ...usuarioLogado} = usuario.rows[0]

    res.status(200).json({ message:"Usuario logado com sucesso",usuarioLogado, token})
  
  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
  }
}

module.exports = {cadastroUsuario, login}