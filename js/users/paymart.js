const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const CHECK_FILE = path.join(__dirname, '../../data', 'chek.json');
const CART_FILE = path.join(__dirname, '../../data', 'cart.json');

router.post('/pay', async (req, res) => {
  const { username, name, amount, paymentType, cardNumber, expiry, cvv, date } = req.body;

  if (!username || !name || !amount || !paymentType || !date) {
    return res.status(400).json({ message: "Barcha kerakli maydonlar to‘ldirilmagan." });
  }

  try {
    // 1. Chekni o‘qish va yozish
    let checkData = {};
    try {
      const file = await fs.readFile(CHECK_FILE, 'utf-8');
      checkData = JSON.parse(file);
    } catch (e) {
      checkData = {};
    }

    if (!checkData[username]) {
      checkData[username] = [];
    }

    const newCheck = {
      name,
      amount,
      paymentType,
      date,
    };

    if (paymentType === "Plastik") {
      newCheck.cardNumber = cardNumber;
      newCheck.expiry = expiry;
      newCheck.cvv = cvv;
    }

    checkData[username].push(newCheck);
    await fs.writeFile(CHECK_FILE, JSON.stringify(checkData, null, 2), 'utf-8');

    // 2. ✅ Savatchani tozalash
    let cartData = {};
    try {
      const file = await fs.readFile(CART_FILE, 'utf-8');
      cartData = JSON.parse(file);
    } catch (e) {
      cartData = {};
    }

    if (cartData[username]) {
      cartData[username] = [];
      await fs.writeFile(CART_FILE, JSON.stringify(cartData, null, 2), 'utf-8');
    }

    // 3. Frontendga xabar va yo‘naltirish
    res.json({
      message: "✅ To‘lov muvaffaqiyatli amalga oshirildi. Savatcha tozalandi.",
      redirectUrl: "/user/cart"
    });

  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "❌ Serverda xatolik yuz berdi." });
  }
});

module.exports = router;
