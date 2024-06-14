// server/mysqlConfig.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'en6779pu.beget.tech',
  user: 'en6779pu_jumproot',
  password: 'TQs8q*qW',
  database: 'en6779pu_jump'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
