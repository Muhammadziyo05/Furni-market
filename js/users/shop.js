const express = require('express');
const fs = require('fs');


const CART_FILE = '../../data/cart.json';

const router = express.Router();

// Savatchaga mahsulot qo‘shish
router.post('/add-to-cart', (req, res) => {
  const { username, name, price, image } = req.body;

  if (!username || !name || !price || !image) {
    return res.status(400).json({ message: 'Maʼlumotlar toʻliq emas' });
  }

  let cartData = {};

  // Fayl mavjud bo‘lsa o‘qib olamiz
  if (fs.existsSync(CART_FILE)) {
    const fileData = fs.readFileSync(CART_FILE, 'utf-8');
    try {
      cartData = JSON.parse(fileData);
    } catch (e) {
      console.error("cart.json faylni o‘qishda xatolik:", e);
    }
  }

  // Foydalanuvchining savatchasi mavjud bo‘lmasa, yaratamiz
  if (!cartData[username]) {
    cartData[username] = [];
  }

  // Mahsulotni savatchaga qo‘shish
  cartData[username].push({
    name: name,
    price: price,
    image: image,
    quantity: 1
  });

  // Yangi holatni yozamiz
  fs.writeFile(CART_FILE, JSON.stringify(cartData, null, 2), (err) => {
    if (err) {
      console.error("Yozishda xatolik:", err);
      return res.status(500).json({ message: "Saqlashda xatolik" });
    }
    res.json({ message: `"${name}" savatchaga qo‘shildi.` });
  });
});

module.exports = router;