const jwt = require("jsonwebtoken")
const senhaJwt = require("../senhaJwt")
const conexao = require("../conexao")

const verificarLogin = async(req, res, next)=>{
  const {authorization } = req.headers
  if(!authorization){
    return res.status(401).json({message: "Usuario não autorizado"})
  }

  const token = authorization.split(' ')[1]

  try {
    const {id} = jwt.verify(token, senhaJwt)
    const {rows, rowsCount} = await conexao.query('select * from usuarios where id = $1',[id])

    if(rowsCount === 0){
      return res.status(401).json({message: "Usuario não autorizado"})
    }

    const {senha, ...usuario} = rows[0]

    req.usuario = usuario

    next()

  } catch (error) {
    res.status(500).json({message: error.message || "Erro interno do servidor"});
  }

}

module.exports = verificarLogin