/****************************************************************************************
 * Objetivo: Controller para produtos do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const produtoDAO = require('../../model/DAO/produto.js')
const message = require('../../modulo/config.js')

const inserirProduto = async function(dadosProduto, contentType, idFuncionario) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonProduto = {}
            
            if (dadosProduto.nome == undefined || dadosProduto.nome == null) {
                return message.ERRO_CAMPOS_OBRIGATORIOS
            } else {
                let novoProduto = await produtoDAO.insertProduto(dadosProduto)
                
                if (novoProduto && idFuncionario && dadosProduto.qtd > 0) {
                    // Criar movimentação automática de entrada para produto novo
                    const controllerMovimentacao = require('../movimentacao/controllerMovimentacao.js')
                    await controllerMovimentacao.criarMovimentacaoAutomatica(
                        novoProduto, 
                        idFuncionario, 
                        'entrada', 
                        dadosProduto.qtd, 
                        'Criação de produto'
                    )
                    
                    jsonProduto.status = message.SUCESSO_ITEM_CRIADO.status
                    jsonProduto.codigo_status = message.SUCESSO_ITEM_CRIADO.codigo_status
                    jsonProduto.mensagem = message.SUCESSO_ITEM_CRIADO.mensagem
                    jsonProduto.produto = dadosProduto
                    jsonProduto.movimentacao_criada = true
                    return jsonProduto
                } else if (novoProduto) {
                    jsonProduto.status = message.SUCESSO_ITEM_CRIADO.status
                    jsonProduto.codigo_status = message.SUCESSO_ITEM_CRIADO.codigo_status
                    jsonProduto.mensagem = message.SUCESSO_ITEM_CRIADO.mensagem
                    jsonProduto.produto = dadosProduto
                    jsonProduto.movimentacao_criada = false
                    return jsonProduto
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

const listarProduto = async function() {
    let jsonProdutos = {}
    let dadosProdutos = await produtoDAO.selectAllProdutos()
    
    if (dadosProdutos) {
        // Verificar produtos com estoque baixo
        let produtosEstoqueBaixo = dadosProdutos.filter(produto => produto.qtd < 5)
        
        // Ordenação alfabética usando algoritmo bubble sort
        for (let i = 0; i < dadosProdutos.length - 1; i++) {
            for (let j = 0; j < dadosProdutos.length - i - 1; j++) {
                if (dadosProdutos[j].nome > dadosProdutos[j + 1].nome) {
                    let temp = dadosProdutos[j]
                    dadosProdutos[j] = dadosProdutos[j + 1]
                    dadosProdutos[j + 1] = temp
                }
            }
        }
        
        jsonProdutos.status = message.SUCESSO_REQUISICAO.status
        jsonProdutos.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
        jsonProdutos.mensagem = message.SUCESSO_REQUISICAO.mensagem
        jsonProdutos.quantidade = dadosProdutos.length
        jsonProdutos.produtos = dadosProdutos
        
        // Adicionar alerta se houver produtos com estoque baixo
        if (produtosEstoqueBaixo.length > 0) {
            jsonProdutos.alerta_estoque = {
                message: `ATENÇÃO: ${produtosEstoqueBaixo.length} produto(s) com estoque baixo (< 5 unidades)`,
                produtos_criticos: produtosEstoqueBaixo
            }
        }
        
        return jsonProdutos
    } else {
        return message.ERRO_NAO_ENCONTRADO
    }
}

const buscarProdutoPorNome = async function(nome) {
    try {
        let nomeProduto = nome
        let jsonProdutos = {}
        
        if (nomeProduto == undefined) {
            return message.ERRO_CAMPOS_OBRIGATORIOS
        } else {
            let dadosProdutos = await produtoDAO.selectProdutosByNome(nomeProduto)
            
            if (dadosProdutos) {
                jsonProdutos.status = message.SUCESSO_REQUISICAO.status
                jsonProdutos.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
                jsonProdutos.mensagem = message.SUCESSO_REQUISICAO.mensagem
                jsonProdutos.quantidade = dadosProdutos.length
                jsonProdutos.produtos = dadosProdutos
                return jsonProdutos
            } else {
                return message.ERRO_NAO_ENCONTRADO
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const buscarProduto = async function(id) {
    try {
        let idProduto = id
        let jsonProduto = {}
        
        if (idProduto == undefined || isNaN(idProduto)) {
            return message.ERRO_ID_INVALIDO
        } else {
            let dadosProduto = await produtoDAO.selectProdutoById(idProduto)
            
            if (dadosProduto) {
                jsonProduto.status = message.SUCESSO_REQUISICAO.status
                jsonProduto.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
                jsonProduto.mensagem = message.SUCESSO_REQUISICAO.mensagem
                jsonProduto.produto = dadosProduto
                
                // Verificar se o produto tem estoque baixo
                if (dadosProduto.qtd < 5) {
                    jsonProduto.alerta_estoque = `ATENÇÃO: Produto com estoque baixo! Apenas ${dadosProduto.qtd} unidade(s) disponível(is).`
                }
                
                return jsonProduto
            } else {
                return message.ERRO_NAO_ENCONTRADO
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const atualizarProduto = async function(dadosProduto, idProduto, contentType, idFuncionario) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonProduto = {}
            
            if (idProduto == undefined || isNaN(idProduto)) {
                return message.ERRO_ID_INVALIDO
            } else {
                let produtoAnterior = await produtoDAO.selectProdutoById(idProduto)
                if (!produtoAnterior) {
                    return message.ERRO_NAO_ENCONTRADO
                }
                
                let produtoAtualizado = await produtoDAO.updateProduto(dadosProduto, idProduto)
                
                if (produtoAtualizado && idFuncionario) {
                    // Criar movimentação automática se quantidade mudou
                    let qtdAnterior = produtoAnterior.qtd
                    let qtdNova = dadosProduto.qtd
                    let diferenca = qtdNova - qtdAnterior
                    
                    if (diferenca !== 0) {
                        const controllerMovimentacao = require('../movimentacao/controllerMovimentacao.js')
                        let tipo = diferenca > 0 ? 'entrada' : 'saida'
                        let quantidade = Math.abs(diferenca)
                        let observacao = `Atualização de produto: ${qtdAnterior} → ${qtdNova}`
                        
                        await controllerMovimentacao.criarMovimentacaoAutomatica(
                            idProduto, 
                            idFuncionario, 
                            tipo, 
                            quantidade, 
                            observacao
                        )
                    }
                    
                    jsonProduto.status = message.SUCESSO_ITEM_ATUALIZADO.status
                    jsonProduto.codigo_status = message.SUCESSO_ITEM_ATUALIZADO.codigo_status
                    jsonProduto.mensagem = message.SUCESSO_ITEM_ATUALIZADO.mensagem
                    jsonProduto.produto = dadosProduto
                    jsonProduto.movimentacao_criada = diferenca !== 0
                    return jsonProduto
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

const deletarProduto = async function(id, idFuncionario) {
    try {
        let idProduto = id
        
        if (idProduto == undefined || isNaN(idProduto)) {
            return message.ERRO_ID_INVALIDO
        } else {
            let produtoAnterior = await produtoDAO.selectProdutoById(idProduto)
            if (!produtoAnterior) {
                return message.ERRO_NAO_ENCONTRADO
            }
            
            // Criar movimentação de saída para zerar estoque antes de deletar
            if (produtoAnterior.qtd > 0 && idFuncionario) {
                const controllerMovimentacao = require('../movimentacao/controllerMovimentacao.js')
                await controllerMovimentacao.criarMovimentacaoAutomatica(
                    idProduto, 
                    idFuncionario, 
                    'saida', 
                    produtoAnterior.qtd, 
                    `Exclusão de produto: ${produtoAnterior.nome}`
                )
            }
            
            let produtoDeletado = await produtoDAO.deleteProduto(idProduto)
            
            if (produtoDeletado) {
                return {
                    ...message.SUCESSO_ITEM_DELETADO,
                    movimentacao_criada: produtoAnterior.qtd > 0
                }
            } else {
                return message.ERRO_SERVIDOR_BD
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const listarProdutosEstoqueBaixo = async function() {
    const estoqueDAO = require('../../model/DAO/estoqueBaixo.js')
    let jsonProdutos = {}
    let produtosBaixo = await estoqueDAO.selectProdutosEstoqueBaixo()
    
    if (produtosBaixo && produtosBaixo.length > 0) {
        jsonProdutos.status = message.SUCESSO_REQUISICAO.status
        jsonProdutos.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
        jsonProdutos.mensagem = "Produtos com estoque crítico encontrados"
        jsonProdutos.alerta = "ATENÇÃO: Os produtos abaixo estão com estoque baixo (< 5 unidades)"
        jsonProdutos.quantidade = produtosBaixo.length
        jsonProdutos.produtos_criticos = produtosBaixo
        return jsonProdutos
    } else {
        jsonProdutos.status = message.SUCESSO_REQUISICAO.status
        jsonProdutos.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
        jsonProdutos.mensagem = "Nenhum produto com estoque baixo"
        jsonProdutos.quantidade = 0
        jsonProdutos.produtos_criticos = []
        return jsonProdutos
    }
}

module.exports = {
    inserirProduto,
    listarProduto,
    buscarProdutoPorNome,
    buscarProduto,
    atualizarProduto,
    deletarProduto,
    listarProdutosEstoqueBaixo
}