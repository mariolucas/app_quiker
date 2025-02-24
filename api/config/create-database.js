const mysql = require('mysql2/promise');
const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  port: process.env.MYSQL_PORT || 3306,
};

const databaseName = process.env.MYSQL_DATABASE;
const MAX_RETRIES = 5; // Número máximo de tentativas
const RETRY_INTERVAL = 5000; // Tempo entre tentativas (em milissegundos)

async function connectWithRetry(retries = MAX_RETRIES) {
  while (retries > 0) {
    try {
      console.log(`Tentando conectar ao MySQL... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);

      const connection = await mysql.createConnection(config);
      console.log("Conectado ao MySQL!");

      const [rows] = await connection.query(`SHOW DATABASES LIKE ?`, [databaseName]);
    
      if (rows.length === 0) {
        console.log(`Criando banco de dados "${databaseName}"...`);
        await connection.query(`CREATE DATABASE ${databaseName}`);
        console.log(`Banco de dados "${databaseName}" criado com sucesso.`);
      } else {
        console.log(`Banco de dados "${databaseName}" já existe.`);
      }

      await connection.end();
      return;
    } catch (error) {
      console.error(`Erro ao conectar ao MySQL: ${error.message}`);
      retries--;

      if (retries === 0) {
        console.error("Falha ao conectar ao banco após várias tentativas.");
        process.exit(1);
      }

      console.log(`Tentando novamente em ${RETRY_INTERVAL / 1000} segundos...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

connectWithRetry();
