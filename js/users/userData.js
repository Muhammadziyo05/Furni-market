const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

const USERS_FILE = path.join(__dirname, '../../data/users.json');
const CART_FILE = path.join(__dirname, '../../data/cart.json');

router.post('/get-profile-data', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Foydalanuvchi nomi yuborilmadi' });
  }

  try {
    const [usersRaw, cartRaw] = await Promise.all([
      fs.readFile(USERS_FILE, 'utf-8'),
      fs.readFile(CART_FILE, 'utf-8')
    ]);

    const users = JSON.parse(usersRaw);
    const carts = JSON.parse(cartRaw);

    if (!users[username]) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const user = users[username];
    const cartCount = carts[username]?.length || 0;

    return res.json({ ...user, cartCount });
  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

router.get('/get-cart/:username', async (req, res) => {
  const username = req.params.username;
  const filePath = path.join(__dirname, '../../data', 'cart.json');
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    const carts = JSON.parse(fileData);
    const userCart = carts[username] || [];
    res.json(userCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xatolik' });
  }
});


module.exports = router;
