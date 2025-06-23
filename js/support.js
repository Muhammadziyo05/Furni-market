const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();
const SUPPORT_FILE = path.join(__dirname, '../data', 'support.json');

router.post('/support', async (req, res) => {
  const { name, email, subject, message, date } = req.body;

  if (!name || !email || !subject || !message || !date) {
    return res.status(400).json({ message: 'Barcha maydonlarni to‘ldiring' });
  }

  try {
    let existing = [];
    try {
      const file = await fs.readFile(SUPPORT_FILE, 'utf-8');
      existing = JSON.parse(file);
    } catch (e) {
      existing = [];
    }

    existing.push({ name, email, subject, message, date });

    await fs.writeFile(SUPPORT_FILE, JSON.stringify(existing, null, 2), 'utf-8');

    res.json({ message: "✅ Xabaringiz yuborildi. Tez orada siz bilan bog‘lanamiz!" });
  } catch (err) {
    console.error('Xatolik:', err);
    res.status(500).json({ message: "❌ Serverda xatolik yuz berdi" });
  }
});

module.exports = router;
