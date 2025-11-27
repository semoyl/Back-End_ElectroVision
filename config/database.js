/****************************************************************************************
 * Objetivo: Configuração de conexão com banco de dados MySQL
 * Data: 30/10/2025
 * Autor: Sistema ElectroVision
 * Versão: 1.0
 **************************************************************************************/

const mysql = require('mysql2/promise');
require('dotenv').config();

// Parseando a DATABASE_URL
const databaseUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
    host: databaseUrl.hostname,
    port: databaseUrl.port || 3306,
    user: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.slice(1),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;