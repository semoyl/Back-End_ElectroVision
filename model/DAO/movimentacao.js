/****************************************************************************************
 * Objetivo: DAO para movimentações do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const db = require('../../config/database')

const selectAllMovimentacoes = async function() {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, h.data, h.resumo, p.nome as produto_nome, f.nome as funcionario_nome
            FROM tbl_estoque e
            JOIN tbl_historico h ON e.id_historico = h.id_historico
            JOIN tbl_produto p ON e.id_produto = p.id_produto
            JOIN tbl_funcionario f ON e.id_funcionario = f.id_funcionario
            ORDER BY h.data DESC
        `)
        return rows
    } catch (error) {
        return false
    }
}

const selectMovimentacoesByProduto = async function(idProduto) {
    try {
        const [rows] = await db.execute(`
            SELECT e.*, h.data, h.resumo, p.nome as produto_nome, f.nome as funcionario_nome
            FROM tbl_estoque e
            JOIN tbl_historico h ON e.id_historico = h.id_historico
            JOIN tbl_produto p ON e.id_produto = p.id_produto
            JOIN tbl_funcionario f ON e.id_funcionario = f.id_funcionario
            WHERE e.id_produto = ?
            ORDER BY h.data DESC
        `, [idProduto])
        return rows
    } catch (error) {
        return false
    }
}

const insertHistorico = async function(dadosHistorico) {
    try {
        const [result] = await db.execute(
            'INSERT INTO tbl_historico (data, resumo) VALUES (?, ?)',
            [dadosHistorico.data, dadosHistorico.resumo]
        )
        return result.insertId
    } catch (error) {
        return false
    }
}

const insertEstoque = async function(dadosEstoque) {
    try {
        const [result] = await db.execute(
            'INSERT INTO tbl_estoque (id_historico, id_produto, id_funcionario) VALUES (?, ?, ?)',
            [dadosEstoque.id_historico, dadosEstoque.id_produto, dadosEstoque.id_funcionario]
        )
        return result.insertId
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllMovimentacoes,
    selectMovimentacoesByProduto,
    insertHistorico,
    insertEstoque
}