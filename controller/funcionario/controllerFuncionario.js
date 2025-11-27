/****************************************************************************************
 * Objetivo: Controller para funcionários do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const funcionarioDAO = require('../../model/DAO/funcionario.js')
const message = require('../../modulo/config.js')

const autenticarFuncionario = async function(dadosFuncionario, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonFuncionario = {}
            
            if (dadosFuncionario.chave == undefined || dadosFuncionario.chave == null) {
                return message.ERRO_CAMPOS_OBRIGATORIOS
            } else {
                let funcionario = await funcionarioDAO.selectFuncionarioByChave(dadosFuncionario.chave)
                
                if (funcionario) {
                    jsonFuncionario.status = message.SUCESSO_REQUISICAO.status
                    jsonFuncionario.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
                    jsonFuncionario.mensagem = message.SUCESSO_REQUISICAO.mensagem
                    jsonFuncionario.funcionario = funcionario
                    return jsonFuncionario
                } else {
                    return message.ERRO_NAO_ENCONTRADO
                }
            }
        } else {
            return message.ERRO_TIPO_CONTEUDO
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const inserirFuncionario = async function(dadosFuncionario, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonFuncionario = {}
            
            if (dadosFuncionario.nome == undefined || dadosFuncionario.nome == null) {
                return message.ERRO_CAMPOS_OBRIGATORIOS
            } else {
                let novoFuncionario = await funcionarioDAO.insertFuncionario(dadosFuncionario)
                
                if (novoFuncionario) {
                    jsonFuncionario.status = message.SUCESSO_ITEM_CRIADO.status
                    jsonFuncionario.codigo_status = message.SUCESSO_ITEM_CRIADO.codigo_status
                    jsonFuncionario.mensagem = message.SUCESSO_ITEM_CRIADO.mensagem
                    jsonFuncionario.funcionario = dadosFuncionario
                    return jsonFuncionario
                } else {
                    return message.ERRO_SERVIDOR_BD
                }
            }
        } else {
            return message.ERRO_TIPO_CONTEUDO
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const listarFuncionario = async function() {
    let jsonFuncionarios = {}
    let dadosFuncionarios = await funcionarioDAO.selectAllFuncionarios()
    
    if (dadosFuncionarios) {
        jsonFuncionarios.status = message.SUCESSO_REQUISICAO.status
        jsonFuncionarios.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
        jsonFuncionarios.mensagem = message.SUCESSO_REQUISICAO.mensagem
        jsonFuncionarios.quantidade = dadosFuncionarios.length
        jsonFuncionarios.funcionarios = dadosFuncionarios
        return jsonFuncionarios
    } else {
        return message.ERRO_NAO_ENCONTRADO
    }
}

const buscarFuncionario = async function(id) {
    try {
        let idFuncionario = id
        let jsonFuncionario = {}
        
        if (idFuncionario == undefined || isNaN(idFuncionario)) {
            return message.ERRO_ID_INVALIDO
        } else {
            let dadosFuncionario = await funcionarioDAO.selectFuncionarioById(idFuncionario)
            
            if (dadosFuncionario) {
                jsonFuncionario.status = message.SUCESSO_REQUISICAO.status
                jsonFuncionario.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
                jsonFuncionario.mensagem = message.SUCESSO_REQUISICAO.mensagem
                jsonFuncionario.funcionario = dadosFuncionario
                return jsonFuncionario
            } else {
                return message.ERRO_NAO_ENCONTRADO
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const atualizarFuncionario = async function(dadosFuncionario, idFuncionario, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonFuncionario = {}
            
            if (idFuncionario == undefined || isNaN(idFuncionario)) {
                return message.ERRO_ID_INVALIDO
            } else {
                let funcionarioAtualizado = await funcionarioDAO.updateFuncionario(dadosFuncionario, idFuncionario)
                
                if (funcionarioAtualizado) {
                    jsonFuncionario.status = message.SUCESSO_ITEM_ATUALIZADO.status
                    jsonFuncionario.codigo_status = message.SUCESSO_ITEM_ATUALIZADO.codigo_status
                    jsonFuncionario.mensagem = message.SUCESSO_ITEM_ATUALIZADO.mensagem
                    jsonFuncionario.funcionario = dadosFuncionario
                    return jsonFuncionario
                } else {
                    return message.ERRO_SERVIDOR_BD
                }
            }
        } else {
            return message.ERRO_TIPO_CONTEUDO
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const deletarFuncionario = async function(id) {
    try {
        let idFuncionario = id
        
        if (idFuncionario == undefined || isNaN(idFuncionario)) {
            return message.ERRO_ID_INVALIDO
        } else {
            let funcionarioDeletado = await funcionarioDAO.deleteFuncionario(idFuncionario)
            
            if (funcionarioDeletado) {
                return message.SUCESSO_ITEM_DELETADO
            } else {
                return message.ERRO_SERVIDOR_BD
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

module.exports = {
    autenticarFuncionario,
    inserirFuncionario,
    listarFuncionario,
    buscarFuncionario,
    atualizarFuncionario,
    deletarFuncionario
}