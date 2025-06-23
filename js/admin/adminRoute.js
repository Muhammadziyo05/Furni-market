// adminRoutes.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../../data/users.json');
const CHECK_FILE = path.join(__dirname, '../../data/chek.json');
const SUPPORT_FILE = path.join(__dirname, '../../data/support.json');



// Foydalanuvchilar ro'yxati
router.get('/admin/user', async (req, res) => {
  try {
    const file = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(file);
    res.json(users);
  } catch (err) {
    console.error('Foydalanuvchilarni yuklashda xatolik:', err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

// To‘lovlar ro‘yxati
router.get('/admin/payment', async (req, res) => {
  try {
    const file = await fs.readFile(CHECK_FILE, 'utf-8');
    const data = JSON.parse(file);
    const payments = Object.entries(data).flatMap(([username, items]) =>
      items.map(item => ({ username, ...item }))
    );
    res.json(payments);
  } catch (err) {
    console.error('To‘lovlarni yuklashda xatolik:', err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

// Support xabarlari ro‘yxati
router.get('/admin/support', async (req, res) => {
  try {
    const file = await fs.readFile(SUPPORT_FILE, 'utf-8');
    const supportMessages = JSON.parse(file);
    res.json(supportMessages);
  } catch (err) {
    console.error('Xabarlarni yuklashda xatolik:', err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

module.exports = router;
