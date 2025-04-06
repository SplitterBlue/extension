require('dotenv').config();
const express = require('express');
const cors = require('cors');
const verifyToken = require('./verifyToken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/auth', verifyToken, async (req, res) => {
  const { sub: auth_id, email, name = 'User' } = req.user;

  try {
    const [rows] = await db.execute(
      'SELECT wallet_balance FROM users WHERE auth_id = ?',
      [auth_id]
    );

    if (rows.length > 0) {
      return res.json({ auth_id, email, name, wallet_balance: rows[0].wallet_balance });
    }

    const defaultBalance = 25;
    await db.execute(
      'INSERT INTO users (auth_id, email, name, wallet_balance) VALUES (?, ?, ?, ?)',
      [auth_id, email, name, defaultBalance]
    );

    return res.json({ auth_id, email, name, wallet_balance: defaultBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Auth API running on http://localhost:${process.env.PORT}`);
});
