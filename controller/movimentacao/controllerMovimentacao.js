/****************************************************************************************
 * Objetivo: Controller para movimentações do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const movimentacaoDAO = require('../../model/DAO/movimentacao.js')
const produtoDAO = require('../../model/DAO/produto.js')
const message = require('../../modulo/config.js')

const inserirMovimentacao = async function(dadosMovimentacao, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let jsonMovimentacao = {}
            
            if (dadosMovimentacao.id_produto == undefined ||
                dadosMovimentacao.id_funcionario == undefined ||
                dadosMovimentacao.tipo == undefined ||
                dadosMovimentacao.quantidade == undefined) {
                return message.ERRO_CAMPOS_OBRIGATORIOS
            } else {
                // Buscar produto para obter nome
                let produto = await produtoDAO.selectProdutoById(dadosMovimentacao.id_produto)
                if (!produto) {
                    return message.ERRO_NAO_ENCONTRADO
                }
                
                // Criar histórico
                let dadosHistorico = {
                    data: dadosMovimentacao.data || new Date().toISOString().split('T')[0],
                    resumo: `${dadosMovimentacao.tipo.toUpperCase()} - ${produto.nome} - Qtd: ${dadosMovimentacao.quantidade}`
                }
                
                let novoHistorico = await movimentacaoDAO.insertHistorico(dadosHistorico)
                
                if (novoHistorico) {
                    // Criar registro na tbl_estoque
                    let dadosEstoque = {
                        id_historico: novoHistorico,
                        id_produto: dadosMovimentacao.id_produto,
                        id_funcionario: dadosMovimentacao.id_funcionario
                    }
                    
                    let novoEstoque = await movimentacaoDAO.insertEstoque(dadosEstoque)
                    
                    if (novoEstoque) {
                        // Atualizar quantidade do produto
                        let novaQuantidade = produto.qtd
                        
                        if (dadosMovimentacao.tipo.toLowerCase() === 'entrada') {
                            novaQuantidade += parseInt(dadosMovimentacao.quantidade)
                        } else if (dadosMovimentacao.tipo.toLowerCase() === 'saida') {
                            novaQuantidade -= parseInt(dadosMovimentacao.quantidade)
                            
                            // Verificação de estoque mínimo
                            if (novaQuantidade < 5) {
                                jsonMovimentacao.alerta_estoque = {
                                    message: "ATENÇÃO: Estoque crítico!",
                                    produto: produto.nome,
                                    quantidade_atual: novaQuantidade,
                                    status: novaQuantidade <= 0 ? "ESGOTADO" : "ESTOQUE BAIXO"
                                }
                            }
                            
                            // Impedir saída se não houver estoque suficiente
                            if (novaQuantidade < 0) {
                                return {
                                    status: false,
                                    codigo_status: 400,
                                    mensagem: "Erro: Quantidade insuficiente em estoque!",
                                    estoque_atual: produto.qtd,
                                    quantidade_solicitada: dadosMovimentacao.quantidade
                                }
                            }
                        }
                        
                        produto.qtd = novaQuantidade
                        await produtoDAO.updateProduto(produto, dadosMovimentacao.id_produto)
                        
                        jsonMovimentacao.status = message.SUCESSO_ITEM_CRIADO.status
                        jsonMovimentacao.codigo_status = message.SUCESSO_ITEM_CRIADO.codigo_status
                        jsonMovimentacao.mensagem = message.SUCESSO_ITEM_CRIADO.mensagem
                        jsonMovimentacao.movimentacao = dadosMovimentacao
                        return jsonMovimentacao
                    } else {
                        return message.ERRO_SERVIDOR_BD
                    }
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

const listarMovimentacao = async function() {
    let jsonMovimentacoes = {}
    let dadosMovimentacoes = await movimentacaoDAO.selectAllMovimentacoes()
    
    if (dadosMovimentacoes) {
        jsonMovimentacoes.status = message.SUCESSO_REQUISICAO.status
        jsonMovimentacoes.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
        jsonMovimentacoes.mensagem = message.SUCESSO_REQUISICAO.mensagem
        jsonMovimentacoes.quantidade = dadosMovimentacoes.length
        jsonMovimentacoes.movimentacoes = dadosMovimentacoes
        return jsonMovimentacoes
    } else {
        return message.ERRO_NAO_ENCONTRADO
    }
}

const buscarMovimentacoesPorProduto = async function(idProduto) {
    try {
        let jsonMovimentacoes = {}
        
        if (idProduto == undefined || isNaN(idProduto)) {
            return message.ERRO_ID_INVALIDO
        } else {
            let dadosMovimentacoes = await movimentacaoDAO.selectMovimentacoesByProduto(idProduto)
            
            if (dadosMovimentacoes) {
                jsonMovimentacoes.status = message.SUCESSO_REQUISICAO.status
                jsonMovimentacoes.codigo_status = message.SUCESSO_REQUISICAO.codigo_status
                jsonMovimentacoes.mensagem = message.SUCESSO_REQUISICAO.mensagem
                jsonMovimentacoes.quantidade = dadosMovimentacoes.length
                jsonMovimentacoes.movimentacoes = dadosMovimentacoes
                return jsonMovimentacoes
            } else {
                return message.ERRO_NAO_ENCONTRADO
            }
        }
    } catch (error) {
        return message.ERRO_SERVIDOR_BD
    }
}

const criarMovimentacaoAutomatica = async function(idProduto, idFuncionario, tipo, quantidade, observacao = '') {
    try {
        let dadosMovimentacao = {
            id_produto: idProduto,
            id_funcionario: idFuncionario,
            tipo: tipo,
            quantidade: quantidade,
            data: new Date().toISOString().split('T')[0]
        }
        
        let produto = await produtoDAO.selectProdutoById(idProduto)
        if (!produto) return false
        
        let resumo = `${tipo.toUpperCase()} AUTOMÁTICA - ${produto.nome} - Qtd: ${quantidade}`
        if (observacao) resumo += ` - ${observacao}`
        
        let dadosHistorico = {
            data: dadosMovimentacao.data,
            resumo: resumo
        }
        
        let novoHistorico = await movimentacaoDAO.insertHistorico(dadosHistorico)
        
        if (novoHistorico) {
            let dadosEstoque = {
                id_historico: novoHistorico,
                id_produto: idProduto,
                id_funcionario: idFuncionario
            }
            
            return await movimentacaoDAO.insertEstoque(dadosEstoque)
        }
        
        return false
    } catch (error) {
        console.error('Erro ao criar movimentação automática:', error)
        return false
    }
}

module.exports = {
    inserirMovimentacao,
    listarMovimentacao,
    buscarMovimentacoesPorProduto,
    criarMovimentacaoAutomatica
}
