/****************************************************************************************
 * Objetivo: DAO para histórico automático do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const db = require('../../config/database')

const insertHistoricoAutomatico = async function(dadosHistorico) {
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

const insertMovimentacaoAutomatica = async function(dadosEstoque) {
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
    insertHistoricoAutomatico,
    insertMovimentacaoAutomatica
}