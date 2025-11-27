/****************************************************************************************
 * Objetivo: DAO para verificação de estoque baixo do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const db = require('../../config/database')

const selectProdutosEstoqueBaixo = async function() {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_produto WHERE qtd < 5')
        return rows
    } catch (error) {
        return false
    }
}

const selectProdutoEstoqueCritico = async function(id) {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_produto WHERE id_produto = ? AND qtd < 5', [id])
        return rows[0]
    } catch (error) {
        return false
    }
}

module.exports = {
    selectProdutosEstoqueBaixo,
    selectProdutoEstoqueCritico
}