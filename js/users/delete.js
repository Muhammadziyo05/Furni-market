const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs').promises;


// Savatchani tozalash

router.delete('/cart/:username', async (req, res) => {
  const username = req.params.username;
  const CART_FILE = path.join(__dirname, '../../data', 'cart.json');

  try {
    const fileData = await fs.readFile(CART_FILE, 'utf-8');
    const cartData = JSON.parse(fileData);

    if (cartData[username]) {
      cartData[username] = [];
      await fs.writeFile(CART_FILE, JSON.stringify(cartData, null, 2));
      return res.json({ message: 'Savatcha tozalandi.' });
    } else {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
    }
  } catch (err) {
    console.error('Xatolik:', err);
    res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
});

// Savatchadan mahsulotni o‘chirish (indeks asosida)
router.delete('/cart/:username/:index', async (req, res) => {
  const username = req.params.username;
  const index = parseInt(req.params.index);
  const CART_FILE = path.join(__dirname, '../../data', 'cart.json');

  try {
    const fileData = await fs.readFile(CART_FILE, 'utf-8');
    const cartData = JSON.parse(fileData);

    if (cartData[username] && cartData[username][index] !== undefined) {
      cartData[username].splice(index, 1);
      await fs.writeFile(CART_FILE, JSON.stringify(cartData, null, 2));
      return res.json({ message: 'Mahsulot o‘chirildi.' });
    } else {
      return res.status(404).json({ message: 'Mahsulot topilmadi.' });
    }
  } catch (err) {
    console.error('Xatolik:', err);
    res.status(500).json({ message: 'O‘chirishda xatolik yuz berdi.' });
  }
});

module.exports = router;
