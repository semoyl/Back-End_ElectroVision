/****************************************************************************************
 * Objetivo: API referente ao projeto Sistema de Gestão de Estoque - ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 * Observação:
 *********Para configurar e instalar a API, precisamos das seguintes bibliotecas
 *              express         npm install express --save
 *              cors            npm install cors --save
 *              body-parser     npm install body-parser --save
 *              mysql2          npm install mysql2 --save
 *              dotenv          npm install dotenv --save
 **************************************************************************************/

//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

//Import das controllers para realizar o CRUD de dados
const controllerFuncionario = require('./controller/funcionario/controllerFuncionario.js')
const controllerProduto = require('./controller/produto/controllerProduto.js')
const controllerMovimentacao = require('./controller/movimentacao/controllerMovimentacao.js')

//Estabelecendo o formato de dados que devera chegar no body da requisição (POST ou PUT)
const bodyParserJSON = bodyParser.json()

//Cria o objeto app para criar a API
const app = express()

//Configurações do cors - Aceita todas as origens
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,id-funcionario')
    next()
})

app.use(cors())

//Middleware para parsing JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*************************** ENDPOINTS DE FUNCIONÁRIOS ***************************/

//Endpoint para autenticar funcionário (login)
app.post('/v1/electrovision/login', async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultLogin = await controllerFuncionario.autenticarFuncionario(dadosBody, contentType)
    response.status(resultLogin.codigo_status)
    response.json(resultLogin)
})

//Endpoint para inserir um funcionário no BD
app.post('/v1/electrovision/funcionario', async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultFuncionario = await controllerFuncionario.inserirFuncionario(dadosBody, contentType)
    response.status(resultFuncionario.codigo_status)
    response.json(resultFuncionario)
})

//Endpoint para retornar uma lista de funcionários
app.get('/v1/electrovision/funcionarios', async function(request, response){
    let resultFuncionario = await controllerFuncionario.listarFuncionario()
    response.status(resultFuncionario.codigo_status)
    response.json(resultFuncionario)
})

//Endpoint para buscar um funcionário pelo ID
app.get('/v1/electrovision/funcionario/:id', async function (request, response) {
    let idFuncionario = request.params.id
    let resultFuncionario = await controllerFuncionario.buscarFuncionario(idFuncionario)
    response.status(resultFuncionario.codigo_status)
    response.json(resultFuncionario)
})

//Endpoint para atualizar um funcionário pelo ID
app.put('/v1/electrovision/funcionario/:id', async function (request, response) {
    let contentType = request.headers['content-type']
    let idFuncionario = request.params.id
    let dadosBody = request.body
    let resultFuncionario = await controllerFuncionario.atualizarFuncionario(dadosBody, idFuncionario, contentType)
    response.status(resultFuncionario.codigo_status)
    response.json(resultFuncionario)
})

//Endpoint para deletar um funcionário pelo ID
app.delete('/v1/electrovision/funcionario/:id', async function (request, response) {
    let idFuncionario = request.params.id
    let resultFuncionario = await controllerFuncionario.deletarFuncionario(idFuncionario)
    response.status(resultFuncionario.codigo_status)
    response.json(resultFuncionario)
})

/*************************** ENDPOINTS DE PRODUTOS ***************************/

//Endpoint para inserir um produto no BD
app.post('/v1/electrovision/produto', async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idFuncionario = request.headers['id-funcionario'] || request.body.id_funcionario
    let resultProduto = await controllerProduto.inserirProduto(dadosBody, contentType, idFuncionario)
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para retornar uma lista de produtos
app.get('/v1/electrovision/produtos', async function(request, response){
    let resultProduto = await controllerProduto.listarProduto()
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para buscar produtos por nome
app.get('/v1/electrovision/produtos/buscar/:nome', async function (request, response) {
    let nome = request.params.nome
    let resultProduto = await controllerProduto.buscarProdutoPorNome(nome)
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para buscar um produto pelo ID
app.get('/v1/electrovision/produto/:id', async function (request, response) {
    let idProduto = request.params.id
    let resultProduto = await controllerProduto.buscarProduto(idProduto)
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para atualizar um produto pelo ID
app.put('/v1/electrovision/produto/:id', async function (request, response) {
    let contentType = request.headers['content-type']
    let idProduto = request.params.id
    let dadosBody = request.body
    let idFuncionario = request.headers['id-funcionario'] || request.body.id_funcionario
    
    console.log('PUT /produto/:id recebido:')
    console.log('ID do produto:', idProduto)
    console.log('Body:', dadosBody)
    console.log('ID Funcionario:', idFuncionario)
    
    let resultProduto = await controllerProduto.atualizarProduto(dadosBody, idProduto, contentType, idFuncionario)
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para deletar um produto pelo ID
app.delete('/v1/electrovision/produto/:id', async function (request, response) {
    let idProduto = request.params.id
    let idFuncionario = request.headers['id-funcionario'] || request.query.id_funcionario
    let resultProduto = await controllerProduto.deletarProduto(idProduto, idFuncionario)
    response.status(resultProduto.codigo_status)
    response.json(resultProduto)
})

//Endpoint para listar produtos com estoque baixo
app.get('/v1/electrovision/produtos/estoque-baixo', async function(request, response){
    let resultProdutos = await controllerProduto.listarProdutosEstoqueBaixo()
    response.status(resultProdutos.codigo_status)
    response.json(resultProdutos)
})

/********************* ENDPOINTS DE MOVIMENTAÇÕES DE ESTOQUE **********************/

//Endpoint para inserir uma movimentação (entrada/saída)
app.post('/v1/electrovision/movimentacao', async function (request, response) {
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let resultMovimentacao = await controllerMovimentacao.inserirMovimentacao(dadosBody, contentType)
    response.status(resultMovimentacao.codigo_status)
    response.json(resultMovimentacao)
})

//Endpoint para listar todas as movimentações
app.get('/v1/electrovision/movimentacoes', async function(request, response){
    let resultMovimentacao = await controllerMovimentacao.listarMovimentacao()
    response.status(resultMovimentacao.codigo_status)
    response.json(resultMovimentacao)
})

//Endpoint para buscar movimentações por produto
app.get('/v1/electrovision/movimentacoes/produto/:id', async function (request, response) {
    let idProduto = request.params.id
    let resultMovimentacao = await controllerMovimentacao.buscarMovimentacoesPorProduto(idProduto)
    response.status(resultMovimentacao.codigo_status)
    response.json(resultMovimentacao)
})



//Endpoint para verificar se a API está funcionando
app.get('/v1/electrovision/status', async function(request, response){
    response.status(200)
    response.json({
        status: true,
        codigo_status: 200,
        mensagem: "API ElectroVision está funcionando ! ! !",
        versao: "1.0"
    })
})

//Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err)
    res.status(500).json({
        status: false,
        codigo_status: 500,
        mensagem: 'Erro interno do servidor'
    })
})

app.listen(3030, function(){
    console.log('API ElectroVision aguardando requisições na porta 8080 . . .')
})