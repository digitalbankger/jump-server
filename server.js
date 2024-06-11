const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('./firebaseAdmin');

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = '7499886297:AAHUe6sSTsLxxL2I_5oPnX8vd_dDXPv2ZYE';
const FIREBASE_WEB_API_KEY = 'AIzaSyCqDERteL9-wqPnIY5XdBxvhgBvnoLx-5o';

app.post('/auth', async (req, res) => {
  const { hash, id, first_name, last_name, username, auth_date } = req.body;

  // Проверка подлинности данных пользователя (упрощенная версия, в реальном приложении рекомендуется усиленная проверка)
  const data = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nusername=${username}`;
  const secretKey = require('crypto').createHash('sha256').update(BOT_TOKEN).digest();
  const checkString = require('crypto').createHmac('sha256', secretKey).update(data).digest('hex');

  if (checkString !== hash) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const customToken = await admin.auth().createCustomToken(id);
    res.json({ token: customToken });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
