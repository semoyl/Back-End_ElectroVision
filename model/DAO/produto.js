/****************************************************************************************
 * Objetivo: DAO para produtos do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const db = require('../../config/database')

const selectAllProdutos = async function() {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_produto')
        return rows
    } catch (error) {
        return false
    }
}

const selectProdutoById = async function(id) {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_produto WHERE id_produto = ?', [id])
        return rows[0]
    } catch (error) {
        return false
    }
}

const selectProdutosByNome = async function(nome) {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_produto WHERE nome LIKE ?', [`%${nome}%`])
        return rows
    } catch (error) {
        return false
    }
}

const insertProduto = async function(dadosProduto) {
    try {
        const [result] = await db.execute(
            'INSERT INTO tbl_produto (nome, especificacao, qtd, prateleira) VALUES (?, ?, ?, ?)',
            [dadosProduto.nome, dadosProduto.especificacao, dadosProduto.qtd || 0, dadosProduto.prateleira]
        )
        return result.insertId
    } catch (error) {
        return false
    }
}

const updateProduto = async function(dadosProduto, id) {
    try {
        await db.execute(
            'UPDATE tbl_produto SET nome = ?, especificacao = ?, qtd = ?, prateleira = ? WHERE id_produto = ?',
            [dadosProduto.nome, dadosProduto.especificacao, dadosProduto.qtd, dadosProduto.prateleira, id]
        )
        return true
    } catch (error) {
        return false
    }
}

const deleteProduto = async function(id) {
    try {
        await db.execute('DELETE FROM tbl_produto WHERE id_produto = ?', [id])
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllProdutos,
    selectProdutoById,
    selectProdutosByNome,
    insertProduto,
    updateProduto,
    deleteProduto
}