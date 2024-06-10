const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const SECRET_KEY = crypto.createHash('sha256').update(TELEGRAM_TOKEN).digest();

const validateTelegramData = (data) => {
  const { hash, ...rest } = data;
  const checkString = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(checkString).digest('hex');
  return hmac === hash;
};

app.post('/auth/telegram', (req, res) => {
  const data = req.body;
  if (validateTelegramData(data)) {
    // Save user data to database
    const user = {
      id: data.id,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      photo_url: data.photo_url,
      auth_date: data.auth_date
    };
    // Save or update user in your database
    // For example, using Firebase:
    // const userRef = firestore.collection('users').doc(data.id);
    // userRef.set(user, { merge: true });

    res.status(200).send(user);
  } else {
    res.status(403).send('Forbidden');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
