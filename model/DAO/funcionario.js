/****************************************************************************************
 * Objetivo: DAO para funcionários do sistema ElectroVision
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const db = require('../../config/database')

const selectAllFuncionarios = async function() {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_funcionario')
        return rows
    } catch (error) {
        return false
    }
}

const selectFuncionarioById = async function(id) {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_funcionario WHERE id_funcionario = ?', [id])
        return rows[0]
    } catch (error) {
        return false
    }
}

const selectFuncionarioByChave = async function(chave) {
    try {
        const [rows] = await db.execute('SELECT * FROM tbl_funcionario WHERE chave = ?', [chave])
        return rows[0]
    } catch (error) {
        return false
    }
}

const insertFuncionario = async function(dadosFuncionario) {
    try {
        const [result] = await db.execute(
            'INSERT INTO tbl_funcionario (nome, chave, cpf, email) VALUES (?, ?, ?, ?)',
            [dadosFuncionario.nome, dadosFuncionario.chave, dadosFuncionario.cpf, dadosFuncionario.email]
        )
        return result.insertId
    } catch (error) {
        return false
    }
}

const updateFuncionario = async function(dadosFuncionario, id) {
    try {
        await db.execute(
            'UPDATE tbl_funcionario SET nome = ?, chave = ?, cpf = ?, email = ? WHERE id_funcionario = ?',
            [dadosFuncionario.nome, dadosFuncionario.chave, dadosFuncionario.cpf, dadosFuncionario.email, id]
        )
        return true
    } catch (error) {
        return false
    }
}

const deleteFuncionario = async function(id) {
    try {
        await db.execute('DELETE FROM tbl_funcionario WHERE id_funcionario = ?', [id])
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    selectAllFuncionarios,
    selectFuncionarioById,
    selectFuncionarioByChave,
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario
}