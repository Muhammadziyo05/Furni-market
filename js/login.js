const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Signup sahifani ochish
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/signup.html'));
});

// login sahifani ochish
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// Signup ma'lumotlarini qabul qilish
router.post('/signup', (req, res) => {
  const { username, email, password, phone, address } = req.body;

  if (!username || !email || !password || !phone || !address) {
    return res.status(400).send('Barcha maydonlar to‘ldirilishi kerak');
  }

  const userData = { username, email, password, phone, address };
  const filePath = path.join(__dirname, '../data', 'users.json');

  fs.readFile(filePath, 'utf8', (readErr, data) => {
    let users = {};

    if (!readErr && data) {
      try {
        users = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send('Faylni o‘qishda xatolik yuz berdi');
      }
    }

    if (users[username]) {
      return res.status(400).send('Bu username allaqachon mavjud');
    }

    users[username] = userData;

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).send('Xatolik yuz berdi');
      res.send(`
        <script>
          alert('Foydalanuvchi muvaffaqiyatli saqlandi!');
          window.location.href = '/user/profile';
        </script>
      `);
    });
  });
});


// Login ma'lumotlarini qabul qilish
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username va parol to‘ldirilishi kerak');
  }

  const adminFilePath = path.join(__dirname, '../data', 'admin.json');
  const userFilePath = path.join(__dirname, '../data', 'users.json');

  // Avval admin.json faylidan tekshir
  fs.readFile(adminFilePath, 'utf8', (adminErr, adminData) => {
    let admins = {};

    if (!adminErr && adminData) {
      try {
        admins = JSON.parse(adminData);
      } catch (err) {
        return res.status(500).send('Admin faylini o‘qishda xatolik yuz berdi');
      }

      if (admins[username] && admins[username].password === password) {
        return res.send(`
          <script>
            localStorage.setItem('currentUser', '${username}');
            alert('Admin sifatida tizimga kirdingiz!');
            window.location.href = '/admin/dashboard';
          </script>
        `);
      }
    }

    // Admin emas bo‘lsa, oddiy foydalanuvchilardan tekshir
    fs.readFile(userFilePath, 'utf8', (userErr, userData) => {
      let users = {};

      if (!userErr && userData) {
        try {
          users = JSON.parse(userData);
        } catch (err) {
          return res.status(500).send('Foydalanuvchilar faylini o‘qishda xatolik yuz berdi');
        }

        if (users[username] && users[username].password === password) {
          return res.send(`
            <script>
              localStorage.setItem('currentUser', '${username}');
              localStorage.setItem('currentUsername', '${username}');
              alert('Muvaffaqiyatli tizimga kirildi!');
              window.location.href = '/user/profile';
            </script>
          `);
        } else {
          return res.send(`
            <script>
              alert('Foydalanuvchi topilmadi yoki parol noto‘g‘ri!');
              window.location.href = '/login';
            </script>
          `);
        }
      } else {
        return res.status(500).send('Foydalanuvchilar faylini o‘qishda xatolik yuz berdi');
      }
    });
  });
});


  module.exports = router;
