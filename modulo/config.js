/****************************************************************************************
 * Objetivo: Arquivo de configuração de mensagens e status da API
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

/************************** MENSAGENS DE ERRO **************************/
const ERRO_ID_INVALIDO = {status: false, codigo_status: 400, mensagem: 'O ID encaminhado na requisição não é válido'}
const ERRO_CAMPOS_OBRIGATORIOS = {status: false, codigo_status: 400, mensagem: 'Existem campos obrigatórios que não foram preenchidos, ou não atendem aos critérios de digitação'}
const ERRO_NAO_ENCONTRADO = {status: false, codigo_status: 404, mensagem: 'Não foram encontrados itens na requisição'}
const ERRO_SERVIDOR_BD = {status: false, codigo_status: 500, mensagem: 'Não foi possível processar a requisição devido a um erro interno do servidor de Banco de Dados. Contate o administrador da API'}
const ERRO_SERVIDOR_INTERNO = {status: false, codigo_status: 500, mensagem: 'Não foi possível processar a requisição devido a um erro interno do servidor. Contate o administrador da API'}
const ERRO_TIPO_CONTEUDO = {status: false, codigo_status: 415, mensagem: 'O content-type encaminhado na requisição não é suportado pelo servidor. Deve-se encaminhar dados no formato application/json'}

/************************** MENSAGENS DE SUCESSO **************************/
const SUCESSO_ITEM_CRIADO = {status: true, codigo_status: 201, mensagem: 'Item criado com sucesso'}
const SUCESSO_ITEM_ATUALIZADO = {status: true, codigo_status: 200, mensagem: 'Item atualizado com sucesso'}
const SUCESSO_ITEM_DELETADO = {status: true, codigo_status: 200, mensagem: 'Item deletado com sucesso'}
const SUCESSO_REQUISICAO = {status: true, codigo_status: 200, mensagem: 'Requisição realizada com sucesso'}

module.exports = {
    ERRO_ID_INVALIDO,
    ERRO_CAMPOS_OBRIGATORIOS,
    ERRO_NAO_ENCONTRADO,
    ERRO_SERVIDOR_BD,
    ERRO_SERVIDOR_INTERNO,
    ERRO_TIPO_CONTEUDO,
    SUCESSO_ITEM_CRIADO,
    SUCESSO_ITEM_ATUALIZADO,
    SUCESSO_ITEM_DELETADO,
    SUCESSO_REQUISICAO
}