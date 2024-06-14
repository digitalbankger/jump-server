const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./mysqlConfig');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/register', (req, res) => {
  const { telegram_id, username, character } = req.body;

  const query = 'SELECT * FROM users WHERE telegram_id = ?';
  mysql.query(query, [telegram_id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Произошла ошибка при проверке пользователя.');
    }

    if (results.length === 0) {
      const insertQuery = 'INSERT INTO users (telegram_id, username, character, level, points) VALUES (?, ?, ?, 1, 1000)';
      mysql.query(insertQuery, [telegram_id, username, character], (err) => {
        if (err) {
          console.error('Database insert error:', err);
          return res.status(500).send('Произошла ошибка при регистрации пользователя.');
        }
        res.send({ message: 'User registered successfully', character });
      });
    } else {
      res.send({ message: 'User already exists', character: results[0].character });
    }
  });
});

app.get('/question', (req, res) => {
  res.send({ question: 'Do you prefer bulls or bears?', options: ['bull', 'bear'] });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
